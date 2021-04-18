import "./App.css";
import { Component } from "react";
import EmailEditor from "react-email-editor";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/dist/react-notifications.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: {},
      errors: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <EmailEditor ref={(editor) => (this.editor = editor)} />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="input-label" htmlFor="Subject">
              Subject:
            </label>
            <input
              type="text"
              name="subject"
              value={this.state.input.subject}
              onChange={this.handleChange}
              className="form-control"
              placeholder="Enter email subject line"
              id="subject"
            />

            <div className="text-danger">{this.state.errors.subject}</div>
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="Email">
              Email Address:
            </label>
            <input
              type="text"
              name="email"
              value={this.state.input.email}
              onChange={this.handleChange}
              className="form-control"
              placeholder="Enter recipient's email address"
              id="email"
            />
            <div className="text-danger">{this.state.errors.email}</div>
          </div>
          <input type="submit" value="Send Email" className="button" />
        </form>
        <NotificationContainer />
      </div>
    );
  }

  handleChange(event) {
    let input = this.state.input;
    input[event.target.name] = event.target.value;

    this.setState({
      input,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let error = this.getEmptyFormData();
    this.setState({ error: error });

    if (this.validate()) {
      this.SendEmail();
    }
  }

  getEmptyFormData() {
    let data = {};
    data["email"] = "";
    data["subject"] = "";
    return data;
  }

  validate() {
    let input = this.state.input;
    let errors = {};
    let isValid = true;

    if (!input["email"]) {
      isValid = false;
      errors["email"] = "Please enter a destination email address";
    }

    if (typeof input["email"] !== "undefined") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(input["email"])) {
        isValid = false;
        errors["email"] = "Please enter valid email address";
      }
    }

    if (!input["subject"]) {
      isValid = false;
      errors["subject"] = "Please enter a subject for the email";
    }

    this.setState({
      errors: errors,
    });

    return isValid;
  }

  SendEmail = () => {
    this.editor.exportHtml((data) => {
      const { _, html } = data;
      const requestBody = {
        Recipient: this.state.input.email,
        Subject: this.state.input.subject,
        Content: html,
      };
      fetch(process.env.REACT_APP_EMAIL_SEND_ENDPOINT, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(requestBody),
      }).then(
        (response) => {
          if (response.status == 200) {
            NotificationManager.success(
              `to address: ${this.state.input.email}`,
              "Email successfully sent"
            );
            let input = this.getEmptyFormData();
            this.setState({ input: input });
          } else {
            NotificationManager.error(
              "Messaged failed to send",
              "Error encountered"
            );
          }
        },
        () => {
          NotificationManager.error(
            "Messaged failed to send",
            "Error encountered"
          );
        }
      );
    });
  };
}

export default App;
