import React from 'react';
import {RegExpUtils} from 'nylas-exports';

import CreatePageForForm from './decorators/create-page-for-form';

class AccountIMAPSettingsForm extends React.Component {
  static displayName = 'AccountIMAPSettingsForm';

  static propTypes = {
    accountInfo: React.PropTypes.object,
    errorFieldNames: React.PropTypes.array,
    submitting: React.PropTypes.bool,
    onConnect: React.PropTypes.func,
    onFieldChange: React.PropTypes.func,
    onFieldKeyPress: React.PropTypes.func,
  };

  static submitLabel = () => {
    return 'Connect Account';
  }

  static titleLabel = () => {
    return 'Setup your account';
  }

  static subtitleLabel = () => {
    return 'Complete the IMAP and SMTP settings below to connect your account.';
  }

  static validateAccountInfo = (accountInfo) => {
    let errorMessage = null;
    const errorFieldNames = [];

    const validServer = (value) => {
      return RegExpUtils.domainRegex().test(value) || RegExpUtils.ipAddressRegex().test(value);
    }

    for (const type of ['imap', 'smtp']) {
      if (!accountInfo[`${type}_host`] || !accountInfo[`${type}_username`] || !accountInfo[`${type}_password`]) {
        return {errorMessage, errorFieldNames, populated: false};
      }
      if (!validServer(accountInfo[`${type}_host`])) {
        errorMessage = "Please provide a valid hostname or IP adddress.";
        errorFieldNames.push(`${type}_host`);
      }
      if (accountInfo[`${type}_host`] === 'imap.gmail.com') {
        errorMessage = "Please link Gmail accounts by choosing 'Google' on the account type screen.";
        errorFieldNames.push(`${type}_host`);
      }
      if (!Number.isInteger(accountInfo[`${type}_port`])) {
        errorMessage = "Please provide a valid port number.";
        errorFieldNames.push(`${type}_port`);
      }
    }

    return {errorMessage, errorFieldNames, populated: true};
  }

  submit() {
    this.props.onConnect();
  }

  renderFieldsForType(type) {
    const {accountInfo, errorFieldNames, submitting, onFieldKeyPress, onFieldChange} = this.props;

    return (
      <div>
        <label forHtml={`${type}_host`}>Server:</label>
        <input
          type="text"
          id={`${type}_host`}
          className={(accountInfo[`${type}_host`] && errorFieldNames.includes(`${type}_host`)) ? 'error' : ''}
          disabled={submitting}
          value={accountInfo[`${type}_host`] || ''}
          onKeyPress={onFieldKeyPress}
          onChange={onFieldChange}
        />

        <div style={{textAlign: 'left'}}>
          <label forHtml={`${type}_port`}>Port:</label>
          <input
            type="text"
            id={`${type}_port`}
            style={{width: 100, marginRight: 20}}
            className={(accountInfo.imap_host && errorFieldNames.includes(`${type}_port`)) ? 'error' : ''}
            disabled={submitting}
            value={accountInfo[`${type}_port`] || ''}
            onKeyPress={onFieldKeyPress}
            onChange={onFieldChange}
          />
          <input
            type="checkbox"
            id={`ssl_required`}
            className={(accountInfo.imap_host && errorFieldNames.includes(`ssl_required`)) ? 'error' : ''}
            disabled={submitting}
            value={accountInfo[`ssl_required`] || ''}
            onKeyPress={onFieldKeyPress}
            onChange={onFieldChange}
          />
          <label forHtml={`ssl_required`} className="checkbox">Require SSL</label>
        </div>

        <label forHtml={`${type}_username`}>Username:</label>
        <input
          type="text"
          id={`${type}_username`}
          className={(accountInfo[`${type}_username`] && errorFieldNames.includes(`${type}_username`)) ? 'error' : ''}
          disabled={submitting}
          value={accountInfo[`${type}_username`] || ''}
          onKeyPress={onFieldKeyPress}
          onChange={onFieldChange}
        />

        <label forHtml={`${type}_password`}>Password:</label>
        <input
          type="password"
          id={`${type}_password`}
          className={(accountInfo[`${type}_password`] && errorFieldNames.includes(`${type}_password`)) ? 'error' : ''}
          disabled={submitting}
          value={accountInfo[`${type}_password`] || ''}
          onKeyPress={onFieldKeyPress}
          onChange={onFieldChange}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="twocol">
        <div className="col">
          <div className="col-heading">Incoming Mail (IMAP):</div>
          {this.renderFieldsForType('imap')}
        </div>
        <div className="col">
          <div className="col-heading">Outgoing Mail (SMTP):</div>
          {this.renderFieldsForType('smtp')}
        </div>
      </div>
    )
  }
}

export default CreatePageForForm(AccountIMAPSettingsForm);
