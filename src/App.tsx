import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Plus, Edit, Trash2, CheckCircle } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Task = { id: number; title: string; completed: boolean };
type Client = { id: number; name: string; email: string; phone: string; vat: string; location: string };
type Product = { id: number; code: string; name: string; quantity: number; packaging: string; price: number };
type Visit = { id: number; datetime: Date; completed: boolean; notes: string };

export default function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <nav className="w-1/6 bg-gray-100 p-4">
          <ul className="space-y-2">
            <li><NavLink to="/tasks" className={({ isActive }) => isActive ? "font-bold" : ""}>Tasks</NavLink></li>
            <li><NavLink to="/clients" className={({ isActive }) => isActive ? "font-bold" : ""}>Clienti</NavLink></li>
            <li><NavLink to="/inventory" className={({ isActive }) => isActive ? "font-bold" : ""}>Inventario</NavLink></li>
            <li><NavLink to="/visits" className={({ isActive }) => isActive ? "font-bold" : ""}>Visite Clienti</NavLink></li>
          </ul>
        </nav>
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/visits" element={<VisitsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const add = () => { if (!text) return; setTasks([...tasks, { id: Date.now(), title: text, completed: false }]); setText(""); };
  const toggle = (id: number) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const remove = (id: number) => setTasks(tasks.filter(t => t.id !== id));

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl mb-4">Tasks</h2>
        <div className="flex mb-4">
          <input className="border p-2 flex-1" value={text} onChange={e => setText(e.target.value)} placeholder="Nuova Task" />
          <Button className="ml-2" onClick={add}><Plus size={16} /></Button>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th>Titolo</th><th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id} className={t.completed ? "line-through" : ""}>
                <td className="border px-2 py-1">{t.title}</td>
                <td className="border px-2 py-1 space-x-2">
                  <Button onClick={() => toggle(t.id)}><CheckCircle size={16} /></Button>
                  <Button onClick={() => remove(t.id)}><Trash2 size={16} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<Omit<Client, 'id'>>({ name:'', email:'', phone:'', vat:'', location:'' });
  const addOrUpdate = () => {
    const exists = clients.find(c => c.email === form.email);
    if (exists) setClients(clients.map(c => c.email === form.email ? { ...c, ...form } : c));
    else setClients([...clients, { id: Date.now(), ...form }]);
    setForm({ name:'', email:'', phone:'', vat:'', location:'' });
  };
  const edit = (c: Client) => setForm({ name: c.name, email: c.email, phone: c.phone, vat: c.vat, location: c.location });
  const remove = (id: number) => setClients(clients.filter(c => c.id !== id));

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl mb-4">Clienti</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <input placeholder="Nome" className="border p-2" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/>
          <input placeholder="Email" className="border p-2" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
          <input placeholder="Telefono" className="border p-2" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}/>
          <input placeholder="P.IVA" className="border p-2" value={form.vat} onChange={e => setForm({...form,vat:e.target.value})}/>
          <input placeholder="Località" className="border p-2 col-span-2" value={form.location} onChange={e => setForm({...form,location:e.target.value})}/>
          <Button className="col-span-2 mt-2" onClick={addOrUpdate}><Plus size={16} /> Salva</Button>
        </div>
        <table className="w-full table-auto">
          <thead><tr className="bg-gray-200"><th>Nome</th><th>Email</th><th>Telefono</th><th>P.IVA</th><th>Località</th><th>Azioni</th></tr></thead>
          <tbody>{clients.map(c=>(
            <tr key={c.id}>
              <td className="border px-2 py-1">{c.name}</td><td className="border px-2 py-1">{c.email}</td><td className="border px-2 py-1">{c.phone}</td><td className="border px-2 py-1">{c.vat}</td><td className="border px-2 py-1">{c.location}</td>
              <td className="border px-2 py-1 space-x-2">
                <Button onClick={()=>edit(c)}><Edit size={16}/></Button><Button onClick={()=>remove(c.id)}><Trash2 size={16}/></Button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function InventoryPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Product, 'id'>>({ code:'', name:'', quantity:1, packaging:'', price:0 });
  const add = () => {
    if (!form.code) return;
    const exists = items.find(i => i.code === form.code);
    if (exists) {
      setItems(items.map(i => i.code === form.code ? {...i, ...form} : i));
    } else {
      setItems([...items, { id:Date.now(), ...form }]);
    }
    setForm({ code:'', name:'', quantity:1, packaging:'', price:0 });
  };
  const remove = (id: number) => setItems(items.filter(i => i.id !== id));
  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl mb-4">Inventario</h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <input placeholder="Codice Prodotto" className="border p-2" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/>
          <input placeholder="Nome Prodotto" className="border p-2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input type="number" placeholder="Quantità" className="border p-2" value={form.quantity} onChange={e=>setForm({...form,quantity:+e.target.value})}/>
          <input placeholder="Confezione" className="border p-2" value={form.packaging} onChange={e=>setForm({...form,packaging:e.target.value})}/>
          <input type="number" placeholder="Prezzo" className="border p-2" value={form.price} onChange={e=>setForm({...form,price:+e.target.value})}/>
          <Button className="mt-2" onClick={add}><Plus size={16}/> Aggiungi</Button>
        </div>
        <table className="w-full table-auto mb-4"><thead><tr className="bg-gray-200"><th>Codice</th><th>Nome</th><th>Quantità</th><th>Confezione</th><th>Prezzo</th><th>Azioni</th></tr></thead><tbody>
          {items.map(i=>(
            <tr key={i.id}><td className="border px-2 py-1">{i.code}</td><td className="border px-2 py-1">{i.name}</td><td className="border px-2 py-1">{i.quantity}</td><td className="border px-2 py-1">{i.packaging}</td><td className="border px-2 py-1">€{i.price.toFixed(2)}</td><td className="border px-2 py-1"><Button onClick={()=>remove(i.id)}><Trash2 size={16}/></Button></td></tr>
          ))}
        </tbody></table>
        <div className="text-right font-semibold">Totale: € {total.toFixed(2)}</div>
      </CardContent>
    </Card>
  );
}

function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [datetime, setDatetime] = useState("");
  const [showCal, setShowCal] = useState(false);

  const add = () => {
    if (!datetime) return;
    setVisits([...visits, { id:Date.now(), datetime: new Date(datetime), completed:false, notes:"" }]);
    setDatetime("");
  };
  const complete = (id:number) => {
    const note = prompt("Note per la visita:") || "";
    setVisits(visits.map(v => v.id===id ? {...v,completed:true,notes:note} : v));
  };
  const remove = (id:number) => setVisits(visits.filter(v => v.id!==id));

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl mb-4">Visite Clienti</h2>
        <div className="flex mb-4">
          <input type="datetime-local" className="border p-2 flex-1" value={datetime} onChange={e=>setDatetime(e.target.value)}/>  
          <Button className="ml-2" onClick={add}><Plus size={16}/></Button>
          <Button className="ml-2" onClick={()=>setShowCal(!showCal)}>Calendario</Button>
        </div>
        {showCal && <Calendar onChange={()=>{}} value={new Date()}/>}
        <table className="w-full table-auto mt-4"><thead><tr className="bg-gray-200"><th>Data/Ora</th><th>Stato</th><th>Note</th><th>Azioni</th></tr></thead><tbody>
          {visits.map(v=>(
            <tr key={v.id}><td className="border px-2 py-1">{v.datetime.toLocaleString()}</td><td className="border px-2 py-1">{v.completed?"Completato":"Pianificato"}</td><td className="border px-2 py-1">{v.notes}</td><td className="border px-2 py-1 space-x-2">
              {!v.completed && <Button onClick={()=>complete(v.id)}><CheckCircle size={16}/></Button>}
              <Button onClick={()=>remove(v.id)}><Trash2 size={16}/></Button>
            </td></tr>
          ))}
        </tbody></table>
      </CardContent>
    </Card>
  );
}