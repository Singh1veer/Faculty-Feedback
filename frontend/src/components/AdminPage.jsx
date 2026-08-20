import AdminFacultyManage from './AdminFacultyManage';
import AdminUserSuspend from './AdminUserSuspend';
import AdminModerationQueue from './AdminModerationQueue';
function AdminPage() {
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