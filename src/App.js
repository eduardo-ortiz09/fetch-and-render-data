import axios from 'axios';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';


const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: true,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
function App() {
  const { Fragment, useState } = React;
  const [query, setQuery] = useState("");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://x-colors.herokuapp.com/api/random",
    {
      hex: "",
      rgb: "",
      hsl: ""
    }
  );
  let style = {
    background: data.hex,
    width: '18em'
  }

  const getRandomColor = () => {
    let color = Math.floor(Math.random()*359).toString(); 
    setQuery(color);
  };

  return (
    <Fragment>
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <Form onSubmit={event => {
          getRandomColor();
          doFetch(`https://x-colors.herokuapp.com/api/random/${query.toLowerCase()}`);
          event.preventDefault();
        }}>
          <Button
            type="submit"
            variant="danger"
            className="m-4"
          >Change Color</Button>
        </Form>

        {isError && <div>Something went wrong ...</div>}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
            <Card className="m-5" style={style}>
              <Card.Body>
                <Card.Title>Generate Random Colors</Card.Title>
                <Card.Text>
                  Click the button to generate a random color.
                </Card.Text>
                <Card.Text>
                  The color is {data.hex}
                </Card.Text>
              </Card.Body>
            </Card>
        )}
        <footer className="text-center fs-3 fw-bold text-white">Copyright © MITXPRO by Eduardo Ortiz</footer>
      </Container>
    </Fragment>
  );
}

export default App;
