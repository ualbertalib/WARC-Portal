# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-20 15:05
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0006_auto_20161027_0313'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='collection',
            options={'ordering': ('id',)},
        ),
        migrations.AlterModelOptions(
            name='document',
            options={'ordering': ('id',)},
        ),
        migrations.AlterModelOptions(
            name='image',
            options={'ordering': ('id',)},
        ),
        migrations.AlterModelOptions(
            name='warcfile',
            options={'ordering': ('id',)},
        ),
        migrations.AddField(
            model_name='document',
            name='score_kv',
            field=models.TextField(blank=True, default='null:0.00, ', help_text='The dictionary of the highest tf-idf score n-grams in a given document.'),
        ),
        migrations.AlterField(
            model_name='collection',
            name='detail',
            field=models.TextField(blank=True, default='', help_text='Description of the collection.'),
        ),
        migrations.AlterField(
            model_name='collection',
            name='name',
            field=models.CharField(blank=True, default='', help_text='Name of the warc file collection.', max_length=100),
        ),
        migrations.AlterField(
            model_name='document',
            name='content',
            field=models.TextField(blank=True, default='', help_text='The body of the web page, removed html tag.'),
        ),
        migrations.AlterField(
            model_name='document',
            name='crawl_date',
            field=models.DateTimeField(help_text='The crawl date of the web page, extracted from Warcbase.'),
        ),
        migrations.AlterField(
            model_name='document',
            name='detail',
            field=models.TextField(blank=True, default='', help_text='Used to store extra info like metadata or label.'),
        ),
        migrations.AlterField(
            model_name='document',
            name='file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rest_api.WarcFile'),
        ),
        migrations.AlterField(
            model_name='document',
            name='link',
            field=models.TextField(blank=True, default='', help_text='URL link to the way back server.'),
        ),
        migrations.AlterField(
            model_name='document',
            name='pub_date',
            field=models.DateTimeField(help_text='The publication date of the web page, using IBM Alchemy APIto query publication date.'),
        ),
        migrations.AlterField(
            model_name='document',
            name='pub_date_confident',
            field=models.BooleanField(default='False', help_text='The confident value from the IBM alchemy query result,true as confident, false as not.'),
        ),
        migrations.AlterField(
            model_name='document',
            name='title',
            field=models.CharField(blank=True, default='', help_text='Title of the web page, extracted from html tile tag, if not found, use the domain name instead.', max_length=255),
        ),
        migrations.AlterField(
            model_name='image',
            name='detail',
            field=models.TextField(blank=True, default='', help_text='Stores meta data of the image.'),
        ),
        migrations.AlterField(
            model_name='image',
            name='link',
            field=models.TextField(blank=True, default='', help_text='URL link to the way back image server.'),
        ),
        migrations.AlterField(
            model_name='image',
            name='name',
            field=models.CharField(blank=True, default='', help_text='The file name of the image.', max_length=100),
        ),
        migrations.AlterField(
            model_name='warcfile',
            name='name',
            field=models.CharField(blank=True, default='', help_text='The name of the warc file', max_length=100),
        ),
    ]
