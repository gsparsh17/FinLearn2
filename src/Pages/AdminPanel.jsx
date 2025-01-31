import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Ban, CheckCircle, ClipboardList } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const sampleUsers = [
  { id: 1, username: "PlayerOne", email: "player1@example.com", status: "Active", balance: 500 },
  { id: 2, username: "ShadowNinja", email: "shadow@example.com", status: "Banned", balance: 100 },
  { id: 3, username: "GameMaster", email: "gm@example.com", status: "Active", balance: 1500 },
  { id: 4, username: "RogueWarrior", email: "rogue@example.com", status: "Inactive", balance: 250 },
];

export default function AdminPanel() {
  const [users, setUsers] = useState(sampleUsers);
  const [search, setSearch] = useState("");
  const [taskDialog, setTaskDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [task, setTask] = useState("");

  const handleBan = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: "Banned" } : user));
  };

  const handleActivate = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: "Active" } : user));
  };

  const openTaskDialog = (user) => {
    setSelectedUser(user);
    setTaskDialog(true);
  };

  const assignTask = () => {
    console.log(`Task assigned to ${selectedUser.username}: ${task}`);
    setTaskDialog(false);
    setTask("");
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-[#00364d] text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-[#ffd451]">Admin Panel</h2>
      <Card className="p-4 shadow-lg bg-[#0078d7] text-white rounded-xl">
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#00364d] border-none text-white px-3 py-2 rounded-lg"
          />
          <Button className="bg-[#ffd451] hover:bg-yellow-500 text-black">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="text-[#ffd451]">
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} className="hover:bg-[#005c91]">
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={user.status === "Banned" ? "bg-red-500" : "bg-green-500"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>${user.balance}</TableCell>
                <TableCell className="flex gap-2">
                  {user.status !== "Banned" ? (
                    <Button variant="destructive" size="sm" onClick={() => handleBan(user.id)}>
                      <Ban className="w-4 h-4 mr-2" /> Ban
                    </Button>
                  ) : (
                    <Button variant="success" size="sm" onClick={() => handleActivate(user.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Activate
                    </Button>
                  )}
                  <Button size="sm" className="bg-[#ffd451] hover:bg-yellow-500 text-black" onClick={() => openTaskDialog(user)}>
                    <ClipboardList className="w-4 h-4 mr-2" /> Assign Task
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Task Assignment Dialog */}
      <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
        <DialogContent className="bg-[#00364d] text-white border-none">
          <DialogHeader>
            <DialogTitle>Assign Task to {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter task description"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="bg-gray-700 border-none text-white px-3 py-2 rounded-lg"
          />
          <DialogFooter>
            <Button onClick={assignTask} className="bg-[#ffd451] hover:bg-yellow-500 text-black">
              Assign Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
