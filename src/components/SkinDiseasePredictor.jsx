import { useState } from "react";
import apiService from "../services/apiService";

function SkinDiseasePredictor() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!file) return setError("Please select an image.");

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await apiService.predictSkinDisease(file, "human-health");
      setResult(res);
    } catch (err) {
      setError(err?.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
      document.querySelector('input[type="file"]').value = "";
    }
  };

  return (
    <div>
      <h2>Skin Disease Detection</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Analyzing..." : "Predict Disease"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>Prediction Result</h3>
          <p>Disease: {result.disease}</p>
          <p>
            Severity:{" "}
            <span
              style={{
                color:
                  result.severity === "emergency"
                    ? "red"
                    : result.severity === "urgent"
                    ? "orange"
                    : "green",
              }}
            >
              {result.severity}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default SkinDiseasePredictor;