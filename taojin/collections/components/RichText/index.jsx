import React from "react";

export default function RichText() {
  return (
    <div>
      <h3>RichText</h3>
      {/* mdn上官方的例子已经废弃了,得重新找一个 */}
      <div id="textBox" contenteditable="true">
        <p>placeholder</p>
      </div>
    </div>
  );
}
