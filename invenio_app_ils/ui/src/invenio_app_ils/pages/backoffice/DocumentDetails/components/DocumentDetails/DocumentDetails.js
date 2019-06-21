import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { DocumentMetadata } from '../';
import { DocumentPendingLoans } from '../DocumentPendingLoans';
import { DocumentItems } from '../DocumentItems';
import { DocumentStats } from '../DocumentStats';

export default class DocumentDetails extends Component {
  render() {
    const { isLoading, data, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <DocumentMetadata document={data} />
          <DocumentPendingLoans document={data} />
          <DocumentItems document={data} />
          <DocumentStats document={data} />
        </Error>
      </Loader>
    );
  }
}

DocumentDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};
