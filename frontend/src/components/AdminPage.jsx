// // import { useState, useEffect } from "react";
// // import AdminFacultyManage from "./AdminFacultyManage";
// // import AdminUserSuspend from "./AdminUserSuspend";
// // import AdminModerationQueue from "./AdminModerationQueue";
// // import VerifyModal from "./GoogleSignIn";

// // function AdminPage() {
// //   const [isAdmin, setIsAdmin] = useState(false);
// //   const [checked, setChecked] = useState(false);

// //   useEffect(() => {
// //     const token = localStorage.getItem("access_token");
// //     if (!token) {
// //       setChecked(true);
// //       return;
// //     }
// //     fetch(`${import.meta.env.VITE_API_URL}/api/admin/protected-test`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     }).then((res) => {
// //       setIsAdmin(res.ok);
// //       setChecked(true);
// //     });
// //   }, []);

// //   if (!checked) return <p>Checking access…</p>;

// //   if (!isAdmin) {
// //     return (
// //       <div>
// //         <p>Admin verification required.</p>
// //         <VerifyModal onStart={() => {}}
// //           // onVerified={() => {
// //           //   const token = localStorage.getItem("access_token");
// //           //   fetch(`${import.meta.env.VITE_API_URL}/api/admin/protected-test`, {
// //           //     headers: { Authorization: `Bearer ${token}` },
// //           //   }).then((res) => setIsAdmin(res.ok));
// //           // }}
// //         />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <h1>Admin Dashboard</h1>
// //       <h2>Manage Faculty</h2>
// //       <AdminFacultyManage />
// //       <h2>Moderation Queue</h2>
// //       <AdminModerationQueue />
// //       <h2>Suspend User</h2>
// //       <AdminUserSuspend />
// //     </div>
// //   );
// // }

// // export default AdminPage;
// import { useState, useEffect } from "react";
// import AdminFacultyManage from "./AdminFacultyManage";
// import AdminUserSuspend from "./AdminUserSuspend";
// import AdminModerationQueue from "./AdminModerationQueue";
// import GoogleSignIn from "./GoogleSignIn";

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
//         <GoogleSignIn />
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
import { signOut } from '../lib/auth';

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { setChecked(true); return; }
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/protected-test`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { setIsAdmin(res.ok); setChecked(true); });
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="font-mono text-sm text-ink-soft animate-pulse">Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper px-6">
        <div className="max-w-sm text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-oxblood mb-2">Restricted</p>
          <h1 className="font-display text-2xl text-ink mb-6">Admin verification required</h1>
          <GoogleSignIn />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between border-b-2 border-ink pb-6 mb-10">
          <h1 className="font-display italic text-4xl text-ink">Admin Dashboard</h1>
          <button onClick={signOut} className="font-mono text-[11px] uppercase tracking-wider text-ink-soft hover:text-oxblood transition-colors duration-150">
            Sign out
          </button>
        </div>

        <section className="mb-12">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-dark mb-4">Manage Faculty</h2>
          <AdminFacultyManage />
        </section>

        <section className="mb-12">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-dark mb-4">Moderation Queue</h2>
          <AdminModerationQueue />
        </section>

        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-dark mb-4">Suspend User</h2>
          <AdminUserSuspend />
        </section>
      </div>
    </div>
  );
}

export default AdminPage;