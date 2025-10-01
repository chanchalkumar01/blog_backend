
async function getRoles() {
    const res = await fetch('http://localhost:3000/api/v1/roles', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  }
  
  export default async function RolesPage() {
    const roles = await getRoles();
  
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Roles</h1>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/2 text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
              <th className="w-1/2 text-left py-3 px-4 uppercase font-semibold text-sm">Permissions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {roles.data.map((role: any) => (
              <tr key={role._id}>
                <td className="text-left py-3 px-4">{role.name}</td>
                <td className="text-left py-3 px-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
