// import { useState, useEffect } from "react";
// import AdminFacultyManage from "./AdminFacultyManage";
// import AdminUserSuspend from "./AdminUserSuspend";
// import AdminModerationQueue from "./AdminModerationQueue";
// import VerifyModal from "./GoogleSignIn";

// function AdminPage() {
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setChecked(true);
//       return;
//     }
//     fetch(`${import.meta.env.VITE_API_URL}/api/admin/protected-test`, {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then((res) => {
//       setIsAdmin(res.ok);
//       setChecked(true);
//     });
//   }, []);

//   if (!checked) return <p>Checking access…</p>;

//   if (!isAdmin) {
//     return (
//       <div>
//         <p>Admin verification required.</p>
//         <VerifyModal onStart={() => {}}
//           // onVerified={() => {
//           //   const token = localStorage.getItem("access_token");
//           //   fetch(`${import.meta.env.VITE_API_URL}/api/admin/protected-test`, {
//           //     headers: { Authorization: `Bearer ${token}` },
//           //   }).then((res) => setIsAdmin(res.ok));
//           // }}
//         />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <h2>Manage Faculty</h2>
//       <AdminFacultyManage />
//       <h2>Moderation Queue</h2>
//       <AdminModerationQueue />
//       <h2>Suspend User</h2>
//       <AdminUserSuspend />
//     </div>
//   );
// }

// export default AdminPage;
import { useState, useEffect } from "react";
import AdminFacultyManage from "./AdminFacultyManage";
import AdminUserSuspend from "./AdminUserSuspend";
import AdminModerationQueue from "./AdminModerationQueue";
import GoogleSignIn from "./GoogleSignIn";

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setChecked(true);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/protected-test`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setIsAdmin(res.ok);
      setChecked(true);
    });
  }, []);

  if (!checked) return <p>Checking access…</p>;

  if (!isAdmin) {
    return (
      <div>
        <p>Admin verification required.</p>
        <GoogleSignIn />
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Manage Faculty</h2>
      <AdminFacultyManage />
      <h2>Moderation Queue</h2>
      <AdminModerationQueue />
      <h2>Suspend User</h2>
      <AdminUserSuspend />
    </div>
  );
}

export default AdminPage;