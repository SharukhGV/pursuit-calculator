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
  const [currentInput, setCurrentInput] = useState(1);
  const [editNumber1, setEditNumber1] = useState("");
  const [editNumber2, setEditNumber2] = useState("");
  const [editOperation, setEditOperation] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const tokenValue = localStorage.getItem("authToken");
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/calculations`, {
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
        `${import.meta.env.VITE_BACKEND}/calculations`,
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


  const startEditing = (calc) => {
    setEditingId(calc.id);
    setEditNumber1(calc.number1);
    setEditNumber2(calc.number2);
    setEditOperation(calc.operation);
  };

  const updateCalculation = async (id) => {
    try {
      const tokenValue = localStorage.getItem("authToken");
      await axios.put(
        `${import.meta.env.VITE_BACKEND}/calculations/${id}`,
        {
          number1: editNumber1,
          number2: editNumber2,
          operation: editOperation,
          email: emailz,
        },
        { headers: { Authorization: `Bearer ${tokenValue}` } }
      );
      setEditingId(null);
      fetchHistory();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const deleteCalculation = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND}/calculations/${id}`, {
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
              {editingId === calc.id ? (
                <div>
                  <input
                    type="number"
                    value={editNumber1}
                    onChange={(e) => setEditNumber1(e.target.value)}
                  />
                  <select
                    value={editOperation}
                    onChange={(e) => setEditOperation(e.target.value)}
                  >
                    <option value="add">+</option>
                    <option value="subtract">-</option>
                    <option value="multiply">×</option>
                    <option value="divide">÷</option>
                  </select>
                  <input
                    type="number"
                    value={editNumber2}
                    onChange={(e) => setEditNumber2(e.target.value)}
                  />
                  <button onClick={() => updateCalculation(calc.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  {calc.number1} {calc.operation} {calc.number2} = {calc.result}
                  <button onClick={() => startEditing(calc)}>Edit</button>
                  <button onClick={() => deleteCalculation(calc.id)}>Delete</button>
                </>
              )}
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