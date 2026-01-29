import { useEffect, useState } from "react";
import http from "../../lib/http";

export default function Lecturers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    http.get("/api/v1/accounts/lecturers")
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Lecturers</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map(l => (
            <tr key={l.id}>
              <td>{l.username}</td>
              <td>{l.email}</td>
              <td>{l.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
