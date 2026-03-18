"use client";

import { useState } from "react";

export default function Home() {
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState("");
  const [output, setOutput] = useState("System Ready...");

const addExpense = async () => {
  try {
    setOutput("Sending...");

    const response = await fetch("http://127.0.0.1:8000/api/expenses/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payer_id: parseInt(payer),
        amount: parseFloat(amount),
        participants: participants.split(",").map((p) => parseInt(p.trim())),
      }),
    });

    const result = await response.text();

    setOutput(result);
  } catch (err) {
    setOutput("Error: " + err);
  }
};

const showBalances = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/balances/");
    const data: any[] = await res.json();

    const userMap: Record<number, string> = {
  1: "Alice",
  2: "Bob",
  3: "Charlie",
};

  const formatted = data
      .map((item) => {
        return `${userMap[item.debtor_id]} owes ${userMap[item.creditor_id]} ₹${item.amount}`;
      })
      .join("\n");

    setOutput(formatted);
  } catch (error) {
    setOutput("Fetch Error: " + String(error));
  }
};

  return (
    <main className="container">
      <div className="card">

        <div className="left">
          <h1 className="title">Expense Sharing App</h1>

          <div className="section">
            <h3>Add Expense</h3>

            <input
              className="input"
              placeholder="Payer ID"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            />

            <input
              className="input"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              className="input"
              placeholder="Participants 1,2,3"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />

            <button type="button" className="button" onClick={addExpense}>
              Add Expense
            </button>
          </div>

          <div className="section">
            <h3>Balances</h3>
            <button type="button" className="button" onClick={showBalances}>
              Show Balances
            </button>
          </div>
        </div>

        <div className="right">
          <h2 className="outputTitle">Output</h2>

          <div className="outputBox">
            <pre>{output}</pre>
          </div>

          <div className="info">
            <p>✔ payer = existing user id</p>
            <p>✔ amount = expense value</p>
            <p>✔ participants = comma separated id</p>
          </div>
        </div>

      </div>
    </main>
  );
}