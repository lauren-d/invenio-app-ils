# -*- coding: utf-8 -*-
#
# Copyright (C) 2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Resolve the EItem referenced in the Document."""

import jsonresolver
from werkzeug.routing import Rule

from invenio_app_ils.search.api import EItemSearch

# Note: there must be only one resolver per file,
# otherwise only the last one is registered


@jsonresolver.hookimpl
def jsonresolver_loader(url_map):
    """Resolve the referred EItems for a Document record."""
    from flask import current_app

    def eitems_resolver(document_pid):
        """Search and return the EItems that reference this Document."""
        eitems = []
        for hit in EItemSearch().search_by_document_pid(document_pid).scan():
            eitem = hit.to_dict()
            eitems.append({
                "eitem_pid": eitem.get("eitem_pid"),
                "description": eitem.get("description"),
                "internal_notes": eitem.get("internal_notes"),
                "open_access": eitem.get("open_access"),
            })
        return eitems

    url_map.add(
        Rule(
            "/api/resolver/documents/<document_pid>/eitems",
            endpoint=eitems_resolver,
            host=current_app.config.get("JSONSCHEMAS_HOST"),
        )
    )
