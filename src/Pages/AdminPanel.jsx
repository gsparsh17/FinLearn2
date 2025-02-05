import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";
import { Search, Ban, CheckCircle, ClipboardList, UserPlus, RefreshCw, Shield, Mail, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// const sampleUsers = [
//   { id: 1, username: "PlayerOne", email: "player1@example.com", status: "Active", balance: 500 },
//   { id: 2, username: "ShadowNinja", email: "shadow@example.com", status: "Banned", balance: 100 },
//   { id: 3, username: "GameMaster", email: "gm@example.com", status: "Active", balance: 1500 },
//   { id: 4, username: "RogueWarrior", email: "rogue@example.com", status: "Inactive", balance: 250 },
// ];

export default function AdminPanel() {
  const [search, setSearch] = useState("");
  const [taskDialog, setTaskDialog] = useState(false);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [task, setTask] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    money: 0
  });

  const [users, setUsers] = useState([]);

  const firebaseConfig = {
    apiKey: "AIzaSyB0bdQZHH22KbmUcXr46xu7Y6m1q1MqGR0",
    authDomain: "cricdata-bdf21.firebaseapp.com",
    projectId: "cricdata-bdf21",
    storageBucket: "cricdata-bdf21.firebasestorage.app",
    messagingSenderId: "191750755116",
    appId: "1:191750755116:web:3ab4b85ec674c45c11d289",
    measurementId: "G-ZH35DGLGDK",
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  useEffect(() => {
    // Fetching user data from Firebase Firestore
    const fetchUsers = async () => {
      try {
        const userCollectionRef = collection(db, 'Users'); // 'Users' is the collection name
        const userSnapshot = await getDocs(userCollectionRef);
        const userList = userSnapshot.docs.map(doc => ({
          ...doc.data(), 
          id: doc.id  // Add the document ID to the user data
        }));
        setUsers(userList); // Set the state with the user list
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const handleBan = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: "Banned" } : user));
    toast.success("User has been banned", {
      icon: <Ban className="w-4 h-4 text-red-500" />
    });
  };

  const handleActivate = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: "Active" } : user));
    toast.success("User has been activated", {
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    });
  };

  const openTaskDialog = (user) => {
    setSelectedUser(user);
    setTaskDialog(true);
  };

  const assignTask = async() => {
    if (!task.trim()) {
      toast.error("Please enter a task description", {
        icon: <ClipboardList className="w-4 h-4 text-red-500" />
      });
      return;
    }
    // Prepare task data
  const taskData = {
    description: task,
    assignedBy: currentUser.name, // Assuming you have a currentUser object
    assignedTo: selectedUser.name,
    assignedAt: new Date(),
    status: 'assigned', // You can change this based on your task flow (e.g., pending, in-progress)
  };

  // Save task to Firestore
  try {
    await setDoc(doc(firestore, 'tasks', selectedUser.id), {
      tasks: firestore.FieldValue.arrayUnion(taskData),
    });

    toast.success(`Task assigned to ${selectedUser.name}`, {
      icon: <ClipboardList className="w-4 h-4 text-green-500" />
    });
    setTaskDialog(false);
    setTask("");
  } catch (error) {
    console.error("Error assigning task: ", error);
    toast.error("Failed to assign task. Please try again later.", {
      icon: <ClipboardList className="w-4 h-4 text-red-500" />
    });
  }
};

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email) {
      toast.error("Please fill in all required fields", {
        icon: <UserPlus className="w-4 h-4 text-red-500" />
      });
      return;
    }
    
    const newId = Math.max(...users.map(u => u.id)) + 1;
    setUsers([...users, {
      id: newId,
      ...newUser,
      status: "Active"
    }]);
    setAddUserDialog(false);
    setNewUser({ username: "", email: "", balance: 0 });
    toast.success("New user added successfully", {
      icon: <UserPlus className="w-4 h-4 text-green-500" />
    });
  };

  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
  );
  

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-[#001a2f] via-[#00364d] to-[#002233] text-white min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#ffd451]" />
          <h2 className="text-4xl font-bold text-[#ffd451] tracking-tight">Admin Dashboard</h2>
        </div>
        <Button 
          onClick={() => setAddUserDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
        >
          <UserPlus className="w-5 h-5 mr-2" /> Add New User
        </Button>
      </div>

      <Card className="p-6 shadow-2xl bg-[#004d80]/90 backdrop-blur-sm text-white rounded-xl border-t border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#00364d]/80 border-none text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-[#ffd451]/50 transition-all"
            />
          </div>
          <Button className="bg-[#003366] hover:bg-[#004080] transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>

        <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#002b3d]">
                <TableHead className="text-[#ffd451] font-semibold">Username</TableHead>
                <TableHead className="text-[#ffd451] font-semibold">Email</TableHead>
                <TableHead className="text-[#ffd451] font-semibold">Status</TableHead>
                <TableHead className="text-[#ffd451] font-semibold">Balance</TableHead>
                <TableHead className="text-[#ffd451] font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} className="hover:bg-[#005c91]/50 transition-all duration-300">
                  <TableCell className="font-medium flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#ffd451]" />
                    {user.name}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#ffd451]" />
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      user.status === "Banned" ? "bg-red-500/20 text-red-400 border-red-500/50" :
                      user.status === "Active" ? "bg-green-500/20 text-green-400 border-green-500/50" :
                      "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                    } border px-3 py-1 rounded-full font-medium shadow-sm`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#ffd451]" />
                    Rs.{user.money.toLocaleString()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {user.status !== "Banned" ? (
                      <Button variant="destructive" size="sm" onClick={() => handleBan(user.id)}
                        className="bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/20">
                        <Ban className="w-4 h-4 mr-2" /> Ban
                      </Button>
                    ) : (
                      <Button variant="success" size="sm" onClick={() => handleActivate(user.id)}
                        className="bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/20">
                        <CheckCircle className="w-4 h-4 mr-2" /> Activate
                      </Button>
                    )}
                    <Button size="sm" className="bg-[#ffd451] hover:bg-yellow-500 text-black transition-all duration-300 shadow-lg hover:shadow-yellow-500/20" 
                      onClick={() => openTaskDialog(user)}>
                      <ClipboardList className="w-4 h-4 mr-2" /> Assign Task
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Task Assignment Dialog */}
      <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
        <DialogContent className="bg-[#00364d] text-white border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#ffd451]" />
              Assign Task to {selectedUser?.username}
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter task description"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="bg-[#002b3d] border-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#ffd451]/50 transition-all"
          />
          <DialogFooter>
            <Button onClick={assignTask} className="bg-[#ffd451] hover:bg-yellow-500 text-black transition-all duration-300 shadow-lg hover:shadow-yellow-500/20">
              <ClipboardList className="w-4 h-4 mr-2" /> Assign Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserDialog} onOpenChange={setAddUserDialog}>
        <DialogContent className="bg-[#00364d] text-white border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#ffd451]" />
              Add New User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              className="bg-[#002b3d] border-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#ffd451]/50 transition-all"
            />
            <Input
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="bg-[#002b3d] border-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#ffd451]/50 transition-all"
            />
            <Input
              placeholder="Initial Balance"
              type="number"
              value={newUser.balance}
              onChange={(e) => setNewUser({...newUser, balance: parseFloat(e.target.value) || 0})}
              className="bg-[#002b3d] border-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#ffd451]/50 transition-all"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddUser} className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20">
              <UserPlus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
