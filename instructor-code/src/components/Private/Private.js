import React, { Component } from 'react';
import axios from 'axios';
import { getUserData } from './../../ducks/users';
import { connect } from 'react-redux';
import './Private.css';

class Private extends Component {
  componentDidMount() {
    axios.get('/api/user-data').then(res => {
      this.props.getUserData(res.data);
    });
  }

  bankBalance() {
    return Math.floor((Math.random() + 100) * 1000);
  }

  render() {
    let { user } = this.props;
    return (
      <div>
        <h2>Account Information</h2>
        <hr />
        <h4>Account Holder: {user.user_name ? user.user_name : null}</h4>
        <p>Account Number: {user.auth_id ? user.auth_id : null}</p>
        <p>Balance: ${this.bankBalance()}.00</p>
        {user.user_pic ? <img className="avatar" src={user.user_pic} /> : null}
        <a href="http://localhost:3005/api/logout">
          <button>Logout</button>
        </a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(
  mapStateToProps,
  { getUserData }
)(Private);
