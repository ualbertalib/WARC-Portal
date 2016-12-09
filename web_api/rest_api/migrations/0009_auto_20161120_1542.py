# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-20 15:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0008_auto_20161120_1533'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='name',
            field=models.CharField(blank=True, default='', help_text='Name of the warc file collection.', max_length=100, unique=True),
        ),
    ]
