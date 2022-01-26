import React from "react";
import "./App.css";
import Note from "./components/Note";
// import RTTest1 from "./components/RTTest1";
export default function App() {
  return (
    <div>
      <h2 className="Group-Name">这是Collections的页面的东西</h2>
      <h3>RichText</h3>
      <Note></Note>
      {/* <RTTest1></RTTest1> */}
    </div>
  );
}
