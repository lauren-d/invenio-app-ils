# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Circulation message factory."""

from functools import partial

from flask import current_app
from invenio_records_rest.utils import obj_or_import_string


def message_factory(loader, *args, **kwargs):
    """Message factory to create a new message.

    :param loader: Callable object that returns a Message object.
    :param args: Positional arguments passed to the loader.
    :param kwargs: Keyword arguments passed to the loader.
    """
    loader_obj = obj_or_import_string(loader)
    return loader_obj(*args, **kwargs)


def loan_message_factory():
    """Create a loan message factory."""
    return partial(
        message_factory,
        current_app.config["LOAN_MSG_LOADER"]
    )
