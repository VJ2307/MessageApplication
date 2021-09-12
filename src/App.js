import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [responseData, setResponseData] = useState([]);

  const [destinationNumber, setDestinationNumber] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showAttributes, setShowAttributes] = useState(false);
  const [data, setData] = useState(null);

  const getMessages = React.useCallback(() => {
    const headers = {
      Authorization: "vishal2",
    };
    axios({
      method: "GET",
      url: "https://ptdhp2zs6e.execute-api.ap-southeast-2.amazonaws.com/test/getmessages",
      headers: headers,
    })
      .then((response) => {
        setResponseData(response.data.body);
        setShowAttributes(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const clearScreen = () => {
    setResponseData([]);
    setShowAttributes(false);
  };

  const clearInput = () => {
    setDestinationNumber("");
    setDescription("");
    setIsError(false);
  };

  const showMessageAttributes = () => {
    return (
      <div class="MessageTable">
        <table class="Messages">
          <thead>
            <tr>
              <th>MessageId</th>
              <th>Destination Number</th>
              <th>Message Description</th>
              <th>Message Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {responseData.map((response) => (
              <tr key={response.Messageid}>
                <td>{response.Messageid}</td>
                <td>{response.DestinationNumber}</td>
                <td>{response.Messagedescription}</td>
                <td>{response.Messagestatus}</td>
                <td>{response.ts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const checkSubmit = () => {
    setLoading(true);
    setIsError(false);
    const dataToSend = {
      destinationNumber: destinationNumber,
      description: description,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "vishal1",
      },
    };
    axios
      .post(
        "https://gclywo4rr8.execute-api.ap-southeast-2.amazonaws.com/test/createmessage",
        dataToSend,
        config
      )
      .then((res) => {
        setData(res.data);
        setDestinationNumber("");
        setDescription("");
        setLoading(false);
      })
      .catch((err) => {
        console.log("I am here!!!");
        setLoading(false);
        setIsError(true);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div class="Main Heading">Welcome to Vishal's Message Hub</div>
      </header>
      <div className="container p-3 mainForm">
        <div style={{ maxWidth: 450 }}>
          <div classNames="form-group">
            <label htmlFor="destinationNumber">Destination Number</label>
            <input
              type="text"
              className="form-control"
              // aria-describedby="inputGroup-sizing-lg"
              id="destinationNumber"
              placeholder="Enter Destination Number"
              value={destinationNumber}
              onChange={(e) => {
                setDestinationNumber(e.target.value);
                setData();
              }}
            />
            <div id="destinationNumber-help" class="form-text">
              We'll never share the entered mobile number with anyone else.
            </div>
          </div>
          <div classNames="form-group">
            <label htmlFor="description" className="mt-3">
              Message Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              placeholder="Enter Message Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {isError && (
            <small className="mt-3 d-inline-block text-danger">
              Something went wrong. Please try again later.
            </small>
          )}
          <button
            type="submit"
            className="btn btn-primary mt-3 btn1"
            onClick={checkSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
          <button onClick={clearInput} className="btn btn-secondary mt-3 btn2">
            Clear Input
          </button>
          {data && (
            <div className="mt-3">
              <strong>Output:</strong>
              <br />
              <pre>{data.body}</pre>
            </div>
          )}
        </div>
      </div>
      <div className="container mt-4" id="showMessages">
        <h3>Fetching All the Messages :</h3>
        <div className="btn-toolbar">
          <button onClick={getMessages} className="btn btn-primary mt-3 btn1">
            History
          </button>
          <button onClick={clearScreen} className="btn btn-secondary mt-3 btn2">
            Clear Screen
          </button>
          {showAttributes && showMessageAttributes()}
        </div>
      </div>
    </div>
  );
}

export default App;
