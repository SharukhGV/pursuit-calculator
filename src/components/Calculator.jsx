import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css"
function Calculator({ emailz }) {
  const [number1, setnumber1] = useState("");
  const [number2, setnumber2] = useState("");
  const [operation, setOperation] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentInput, setCurrentInput] = useState(1); // Tracks which input is active

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const tokenValue = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:5000/calculations", {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
        params: { email: emailz },
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleNumberClick = (num) => {
    if (currentInput === 1) {
      setnumber1((prev) => prev + num);
    } else {
      setnumber2((prev) => prev + num);
    }
  };

  const handleOperationClick = (op) => {
    if (!number1) return; // Ensure first number is present
    setOperation(op);
    setCurrentInput(2); // Switch to the second input
  };

  const calculateResult = () => {
    const num1 = parseFloat(number1);
    const num2 = parseFloat(number2);

    if (isNaN(num1) || isNaN(num2)) {
      alert("Please enter valid numbers");
      return;
    }

    let calculatedResult = null;
    switch (operation) {
      case "add":
        calculatedResult = num1 + num2;
        break;
      case "subtract":
        calculatedResult = num1 - num2;
        break;
      case "multiply":
        calculatedResult = num1 * num2;
        break;
      case "divide":
        calculatedResult = num2 !== 0 ? num1 / num2 : "Error: Division by zero";
        break;
      default:
        alert("Please select a valid operation");
        return;
    }

    setResult(calculatedResult);
    saveCalculation(num1, num2, operation, calculatedResult);
    handleClear(); // Reset inputs for the next calculation
  };

  const saveCalculation = async (num1, num2, op, res) => {
    try {
      const tokenValue = localStorage.getItem("authToken");
      await axios.post(
        "http://localhost:5000/calculations",
        {
          number1: num1,
          number2: num2,
          operation: op,
          result: res,
          email: emailz,
        },
        {
          headers: { Authorization: `Bearer ${tokenValue}` },
        }
      );
      fetchHistory();
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  const handleClear = () => {
    setnumber1("");
    setnumber2("");
    setOperation("");
    setCurrentInput(1);
    setResult(null);
  };

  const updateCalculation = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/calculations/${id}`,
        { number1, number2, operation, email: emailz },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setEditingId(null);
      fetchHistory();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const deleteCalculation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/calculations/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        data: { email: emailz },
      });
      fetchHistory();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div>
      <br></br>
      <div className="calculator">
        <div className="display">
          <div className="input-container">
            <input type="text" value={number1} readOnly placeholder="0" />
            <span>{operation}</span>
            <input type="text" value={number2} readOnly placeholder="0" />
          </div>
          {result !== null && <div className="result">= {result}</div>}
        </div>
        <div className="button-container">
          <div className="number-buttons">
            {[...Array(10).keys()].map((num) => (
              <button key={num} onClick={() => handleNumberClick(num.toString())}>
                {num}
              </button>
            ))}
          </div>
          <div className="operation-buttons">
            <button onClick={() => handleOperationClick("add")}>+</button>
            <button onClick={() => handleOperationClick("subtract")}>-</button>
            <button onClick={() => handleOperationClick("multiply")}>×</button>
            <button onClick={() => handleOperationClick("divide")}>÷</button>
          </div>
          <div className="action-buttons">
            <button onClick={calculateResult}>Enter</button>
            <button onClick={handleClear}>Clear</button>
          </div>
        </div>
      </div>
      <h3>History</h3>
      <ul>
        {Array.isArray(history) && history.length > 0 ? (
          history.map((calc) => (
            <li key={calc.id}>
              {calc.number1} {calc.operation} {calc.number2} = {calc.result}
              <button onClick={() => setEditingId(calc.id)}>Edit</button>
              <button onClick={() => deleteCalculation(calc.id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No history found</li>
        )}
      </ul>
    </div>
  );
}

export default Calculator;
