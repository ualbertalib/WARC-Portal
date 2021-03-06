import os
import json
import re
import codecs
from bs4 import BeautifulSoup
from datetime import datetime
from django.core.management.base import BaseCommand
from ...models import Document, WarcFile, Image
import urllib
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
import hashlib
from django.core.exceptions import ObjectDoesNotExist


DIR = "/mnt/md0/spark_out/"
IMG_DIR = "/mnt/md0/spark_image/"
PDF_DIR = "/mnt/md0/spark_pdf/"
LINK_DIR = "/mnt/md0/spark_sitelink/"
PDF_STORE = "/mnt/md0/pdf_store/"


class Command(BaseCommand):
    def handle(self, *args, **options):
        # parse DIR
        print 'parsing ' + DIR
        for warc_file_name in os.listdir(DIR):
            for outfile in os.listdir(DIR+warc_file_name):
                if outfile.startswith('part'):
                    print "Parsing..." + warc_file_name.encode('unicode_escape')
                    f = codecs.open(DIR+warc_file_name+'/'+outfile, encoding='utf-8')
                    # record warc file name
                    warc, created = WarcFile.objects.get_or_create(name=warc_file_name)
                    for line in f:
                        try:
                            data = json.loads(line)
                            if len(data) != 5:
                                print "Did not parse %s" % data[3].encode('unicode_escape')
                                raise
                        except Exception, e:
                            print e
                            print "Error parsing JSON"

                        # fetch domain
                        domain = data[1]

                        # fetch web page title and content
                        soup = BeautifulSoup(data[3], "html.parser")
                        # remove <script> tag
                        [s.extract() for s in soup('script')]
                        try:
                            title = soup.title.string
                            # title = title.replace("<title>", "")
                        except AttributeError:
                            title = ''
                        # handle 'NoneType' object error
                        if title is None:
                            title = ''
                        title = title.replace('\t', '')
                        title = title.replace('\n', '')
                        title = title.replace('\r', '')
                        title = title[:254]
                        text = soup.get_text()
                        text = re.sub(' +', ' ', text)  # remove spaces
                        text = text.replace('\n', ' ').replace('\r', '')
                        if title == '':
                            title = domain
                        if title == '':
                            title = 'none'

                        # just populate place holding data now, retrieve info from Waston later
                        date = '19700101000000'
                        confident = False

                        # MySQL has issue with 4 byte unicode character, escape unicode character for now
                        # try:
                        #     title = title.encode('unicode_escape')
                        # except Exception, e:
                        #     print e
                        #     title = 'invalid_encoding'
                        #
                        #
                        # try:
                        #     link = data[2].encode('unicode_escape')
                        # except Exception, e:
                        #     print e
                        #     link = 'invalid_encoding'
                        #
                        # try:
                        #     text = text.encode('unicode_escape')
                        # except Exception, e:
                        #     print e
                        #     text = 'invalid_encoding'

                        # remove unicode xa0 to avoid bad tf-idf for now
                        # text = text.replace('xa0', '')

                        try:
                            _ = datetime.strptime(date, '%Y%m%d%H%M%S'),
                        except Exception, e:
                            print e, 'Wrong time format'
                            date = '19700101000000'

                        try:
                            link = data[2]
                        except Exception, e:
                            print e
                            link = 'could not parse link'

                        # comparing hash value with existing doc to avoid duplication
                        m = hashlib.md5()
                        m.update((text+link).encode('unicode_escape'))
                        doc_hash = m.hexdigest()
                        try:
                            Document.objects.get(hash=doc_hash)
                            print "hash identical skipping"
                            continue
                        except ObjectDoesNotExist:
                            print "adding "+title.encode('unicode_escape')

                        # store documents
                        Document.objects.create(
                            title=title[:254],
                            domain=domain,
                            file=warc,
                            pub_date=datetime.strptime(date, '%Y%m%d%H%M%S'),
                            pub_date_confident=confident,
                            crawl_date=datetime.strptime(data[0], '%Y%m%d').strftime("%Y-%m-%d"),
                            link=link,
                            content=text,
                            type='html',
                            hash=doc_hash
                        )

        # parse PDF_DIR
        print 'parsing '+PDF_DIR
        for warc_file_name in os.listdir(PDF_DIR):
            for outfile in os.listdir(PDF_DIR+warc_file_name):
                if outfile.startswith('part'):
                    print "Parsing..." + warc_file_name.encode('unicode_escape')
                    f = codecs.open(PDF_DIR+warc_file_name+'/'+outfile, encoding='utf-8')
                    # record warc file name
                    warc, created = WarcFile.objects.get_or_create(name=warc_file_name)
                    for line in f:
                        try:
                            data = json.loads(line)
                            crawl_date, mime, domain, url = data
                            # filename = url.split('?')[0].split('/')[-1].encode('unicode_escape')
                            filename = url.split('?')[0].split('/')[-1]
                        except Exception, e:
                            print e
                            continue

                        try:
                            urllib.urlretrieve(url, PDF_STORE+filename)
                            fp = open(PDF_STORE+filename, 'rb')
                            parser = PDFParser(fp)
                            doc = PDFDocument(parser)
                        except Exception, e:
                            print e
                            title = filename
                            pub_date = '19700101000000'
                            confident = False
                            print 'using filename as title:' + filename.encode('unicode_escape')
                            # store pdf documents
                            Document.objects.create(
                                title=title,
                                domain=domain,
                                file=warc,
                                pub_date=datetime.strptime(pub_date, '%Y%m%d%H%M%S'),
                                pub_date_confident=confident,
                                crawl_date=datetime.strptime(crawl_date, '%Y%m%d').strftime("%Y-%m-%d"),
                                link=url,
                                content='',
                                type='pdf',
                            )
                            continue

                        try:
                            pub_date = doc.info[0]['ModDate'][2:16]
                            confident = True
                            _ = datetime.strptime(pub_date, '%Y%m%d%H%M%S')
                        except Exception, e:
                            print e
                            pub_date = '19700101000000'
                            confident = False

                        try:
                            title = doc.info[0]['Title']
                        except Exception, e:
                            print e
                            title = 'could not parse title'

                        # try:
                        #     title = title.encode('unicode_escape')
                        # except Exception, e:
                        #     print e
                        #     title = 'invalid encoding'

                        try:
                            print title
                        except Exception, e:
                            print e, 'Could not print image title'

                        # store pdf documents
                        Document.objects.create(
                            title=title,
                            domain=domain,
                            file=warc,
                            pub_date=datetime.strptime(pub_date, '%Y%m%d%H%M%S'),
                            pub_date_confident=confident,
                            crawl_date=datetime.strptime(crawl_date, '%Y%m%d').strftime("%Y-%m-%d"),
                            link=url,
                            content='',
                            type='pdf',
                        )

        # parse IMG_DIR
        print 'parsing ' + IMG_DIR
        for warc_file_name in os.listdir(IMG_DIR):
            for outfile in os.listdir(IMG_DIR+warc_file_name):
                if outfile.startswith('part'):
                    print "Parsing..." + warc_file_name.encode('unicode_escape')
                    f = codecs.open(IMG_DIR+warc_file_name+'/'+outfile, encoding='utf-8')
                    # record warc file name
                    warc, created = WarcFile.objects.get_or_create(name=warc_file_name)
                    for line in f:
                        try:
                            data = json.loads(line)
                        except Exception, e:
                            print e
                            print "Error parsing JSON"
                        # parse and store images
                        if data[0]:
                            if data[0] == '':
                                continue

                            try:
                                print data[0]
                            except Exception, e:
                                print e

                            link = data[0]

                            # fetch classification data using IBM Watson
                            # payload = {
                            #     'api_key': '7aebad6ade1e483d6b9252f42bdefa0210f7e9d7',
                            #     'version': '016-05-20',
                            #     'url': link,
                            # }
                            # api_url = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify'
                            # r = requests.get(api_url, params=payload)
                            # detail = ''
                            # # print r.json()
                            # try:
                            #     for cls in r.json()['images'][0]['classifiers'][0]['classes']:
                            #         detail = detail + cls['class'] + ', '
                            # except Exception, e:
                            #     print e
                            #     detail = ''

                            # KeyValue: no classification info for current img
                            # ValueError: IBM BlueMix daily exceeded
                            # {
                            #   "status": "ERROR",
                            #   "statusInfo": "daily-transaction-limit-exceeded"
                            # }

                            detail = ''

                            name = link.split('?')[0].split('/')[-1]
                            date = '19700101000000'

                            # try:
                            #     name = name.encode('unicode_escape')
                            #     link = link.encode('unicode_escape')
                            # except Exception, e:
                            #     print e
                            #     name = 'invalid_encoding'
                            #     link = 'invalid_encoding'

                            Image.objects.create(
                                crawl_date=datetime.strptime(date, '%Y%m%d%H%M%S'),
                                name=name[:99],
                                detail=detail,
                                link=link,
                                file=warc,
                            )
