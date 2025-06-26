// app/ui/dashboard/berandaDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RiAnchorFill, 
  RiShipFill, 
  RiRouteFill, 
  RiUserFill,
  RiTicketFill,
  RiCalendarFill,
  RiMoneyDollarCircleFill,
  RiArrowUpFill,
  RiArrowDownFill,
  RiEyeFill,
  RiArrowRightSFill,
  RiRefreshLine,
  RiDownloadLine,
  RiAlarmWarningFill,
  RiCheckboxCircleFill,
  RiTimeFill,
  RiUserLocationFill
} from "react-icons/ri";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { Calendar, TrendingUp, Users, Ship, AlertTriangle, CheckCircle } from "lucide-react";

// ✅ Stats Cards Data dengan real-time indicators
const statsData = [
  { 
    title: "Total Pelabuhan", 
    jumlah: 6, 
    icon: RiAnchorFill, 
    color: "bg-blue-50", 
    textColor: "text-blue-700",
    bgIcon: "bg-blue-100",
    trend: "+12%",
    trendUp: true,
    subtitle: "Aktif beroperasi"
  },
  { 
    title: "Armada Kapal", 
    jumlah: 4, 
    icon: RiShipFill, 
    color: "bg-purple-50", 
    textColor: "text-purple-700",
    bgIcon: "bg-purple-100",
    trend: "0%",
    trendUp: null,
    subtitle: "Siap berlayar"
  },
  { 
    title: "Rute Aktif", 
    jumlah: 6, 
    icon: RiRouteFill, 
    color: "bg-green-50", 
    textColor: "text-green-700",
    bgIcon: "bg-green-100",
    trend: "+25%",
    trendUp: true,
    subtitle: "Rute beroperasi"
  },
  { 
    title: "Staff Petugas", 
    jumlah: 12, 
    icon: RiUserFill, 
    color: "bg-orange-50", 
    textColor: "text-orange-700",
    bgIcon: "bg-orange-100",
    trend: "+8%",
    trendUp: true,
    subtitle: "Petugas aktif"
  },
];

// ✅ Additional Metrics untuk Admin
const operationalStats = [
  {
    title: "Tiket Hari Ini",
    value: 1247,
    icon: RiTicketFill,
    color: "bg-cyan-50",
    textColor: "text-cyan-700",
    bgIcon: "bg-cyan-100",
    change: "+18%",
    changeType: "increase"
  },
  {
    title: "Pendapatan Hari Ini",
    value: "Rp 45.2M",
    icon: RiMoneyDollarCircleFill,
    color: "bg-emerald-50",
    textColor: "text-emerald-700",
    bgIcon: "bg-emerald-100",
    change: "+12%",
    changeType: "increase"
  },
  {
    title: "Keberangkatan Hari Ini",
    value: 24,
    icon: RiCalendarFill,
    color: "bg-indigo-50",
    textColor: "text-indigo-700",
    bgIcon: "bg-indigo-100",
    change: "0%",
    changeType: "neutral"
  },
  {
    title: "Tingkat Okupansi",
    value: "87%",
    icon: RiArrowUpFill,
    color: "bg-rose-50",
    textColor: "text-rose-700",
    bgIcon: "bg-rose-100",
    change: "+5%",
    changeType: "increase"
  },
];

// ✅ Chart Data
const salesData = [
  { name: 'Sen', tiket: 140, pendapatan: 12.5 },
  { name: 'Sel', tiket: 180, pendapatan: 15.8 },
  { name: 'Rab', tiket: 220, pendapatan: 18.2 },
  { name: 'Kam', tiket: 190, pendapatan: 16.1 },
  { name: 'Jum', tiket: 250, pendapatan: 21.3 },
  { name: 'Sab', tiket: 300, pendapatan: 25.7 },
  { name: 'Min', tiket: 280, pendapatan: 23.9 },
];

const routeUsageData = [
  { name: 'Singkil-Sibolga', value: 35, color: '#3B82F6' },
  { name: 'Singkil-Medan', value: 28, color: '#8B5CF6' },
  { name: 'Sibolga-Pulau Banyak', value: 22, color: '#10B981' },
  { name: 'Medan-Sibolga', value: 15, color: '#F59E0B' },
];

// ✅ Recent Activities Data
const recentActivities = [
  {
    id: 1,
    type: "ticket",
    message: "125 tiket terjual untuk rute Singkil-Sibolga",
    time: "5 menit lalu",
    icon: RiTicketFill,
    color: "text-blue-600"
  },
  {
    id: 2,
    type: "departure",
    message: "KMP Serbajadi berangkat tepat waktu",
    time: "15 menit lalu",
    icon: RiShipFill,
    color: "text-green-600"
  },
  {
    id: 3,
    type: "alert",
    message: "Cuaca buruk dilaporkan di rute Sibolga",
    time: "1 jam lalu",
    icon: RiAlarmWarningFill,
    color: "text-orange-600"
  },
  {
    id: 4,
    type: "staff",
    message: "Petugas baru ditugaskan di Pelabuhan Singkil",
    time: "2 jam lalu",
    icon: RiUserLocationFill,
    color: "text-purple-600"
  },
];

export default function Beranda() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* ✅ Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang kembali! Berikut ringkasan sistem hari ini.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Waktu Server</p>
            <p className="text-lg font-semibold text-gray-900">
              {currentTime.toLocaleTimeString('id-ID')}
            </p>
            <p className="text-sm text-gray-600">
              {currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RiRefreshLine className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <RiDownloadLine className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className={`${item.color} border-0 hover:shadow-md transition-shadow duration-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`w-12 h-12 ${item.bgIcon} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className={`text-xl ${item.textColor}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
                    <p className={`text-3xl font-bold ${item.textColor} mb-1`}>{item.jumlah}</p>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {item.trendUp === true && <RiArrowUpFill className="w-4 h-4 text-green-500" />}
                      {item.trendUp === false && <RiArrowDownFill className="w-4 h-4 text-red-500" />}
                      <span className={`text-sm font-medium ${
                        item.trendUp === true ? 'text-green-600' : 
                        item.trendUp === false ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {item.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ✅ Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operationalStats.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className={`${item.color} border-0 hover:shadow-md transition-shadow duration-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${item.bgIcon} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`text-lg ${item.textColor}`} />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      item.changeType === 'increase' ? 'bg-green-100 text-green-700' :
                      item.changeType === 'decrease' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.change}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
                <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ✅ Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Tren Penjualan 7 Hari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tiket" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tiket">Tiket Terjual</TabsTrigger>
                <TabsTrigger value="pendapatan">Pendapatan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tiket">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="tiket" stroke="#3B82F6" fill="#93C5FD" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="pendapatan">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`Rp ${value}M`, 'Pendapatan']} />
                    <Area type="monotone" dataKey="pendapatan" stroke="#10B981" fill="#86EFAC" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Route Usage Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="w-5 h-5 text-purple-600" />
              Penggunaan Rute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={routeUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {routeUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-4">
              {routeUsageData.map((route, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: route.color }}
                    ></div>
                    <span className="text-gray-600">{route.name}</span>
                  </div>
                  <span className="font-medium">{route.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiTimeFill className="w-5 h-5 text-gray-600" />
                Aktivitas Terbaru
              </div>
              <Button variant="ghost" size="sm">
                <RiEyeFill className="w-4 h-4 mr-1" />
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 mb-1">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RiCheckboxCircleFill className="w-5 h-5 text-green-600" />
              Status Sistem & Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* System Status */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Status Sistem</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Server Online</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Normal</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">24 User Aktif</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Online</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">Pemeliharaan 2 Kapal</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Maintenance</Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Aksi Cepat</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <RiTicketFill className="w-4 h-4 mr-2" />
                  Lihat Tiket
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <RiShipFill className="w-4 h-4 mr-2" />
                  Kelola Kapal
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <RiUserFill className="w-4 h-4 mr-2" />
                  Kelola User
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <RiRouteFill className="w-4 h-4 mr-2" />
                  Kelola Rute
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}