import React, { useState } from "react";

const FilterBox = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="filter-box"
      style={{
        marginBottom: 20,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        border: "1px solid #e0e0e0",
        background: "#fff",
      }}
    >
      <div
        className="filter-box-header"
        style={{
          background: "#5da3e3",
          color: "#fff",
          padding: "12px 18px 10px 18px",
          borderRadius: "8px 8px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 18,
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <span style={{ fontSize: 22, fontWeight: 400 }}>
          {open ? "–" : "+"}
        </span>
      </div>
      {open && (
        <div
          className="filter-box-content"
          style={{ padding: "16px 18px 14px 18px" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterBox;
