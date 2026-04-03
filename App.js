import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ScrollView, RefreshControl, ActivityIndicator, Modal, FlatList,
  KeyboardAvoidingView, Platform, Animated, Dimensions
} from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const API = axios.create({ baseURL: 'http://localhost:5000/api', headers: { 'Content-Type': 'application/json' } });

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Salary', 'Freelance', 'Other'];

// ========== PROFESSIONAL LOGIN/REGISTER SCREEN with GOOGLE ==========
function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Demo Google Sign-In - For assignment demonstration
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    
    // Simulate Google Sign-In for demo purposes
    // In production, replace with actual Google OAuth
    setTimeout(async () => {
      const demoGoogleUser = {
        name: 'Google User',
        email: `google_user_${Date.now()}@gmail.com`,
        password: 'google-auth-demo-' + Date.now(),
      };
      
      try {
        // Try to register with Google email
        const registerResponse = await API.post('/auth/register', demoGoogleUser);
        if (registerResponse.data.token) {
          localStorage.setItem('token', registerResponse.data.token);
          localStorage.setItem('user', JSON.stringify(registerResponse.data.user));
          onLogin(registerResponse.data.user);
          Alert.alert('Success', 'Signed in with Google!');
        }
      } catch (error) {
        // If email exists, try to login
        try {
          const loginResponse = await API.post('/auth/login', {
            email: demoGoogleUser.email,
            password: demoGoogleUser.password
          });
          if (loginResponse.data.token) {
            localStorage.setItem('token', loginResponse.data.token);
            localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
            onLogin(loginResponse.data.user);
            Alert.alert('Success', 'Signed in with Google!');
          }
        } catch (loginErr) {
          Alert.alert('Google Sign-In', 'Please register with email first, then use Google Sign-In');
        }
      }
      setGoogleLoading(false);
    }, 1500);
  };

  const switchMode = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setIsLogin(!isLogin);
      setEmail('');
      setPassword('');
      setName('');
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    });
  };

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Weak Password', 'Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const response = await API.post(endpoint, payload);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin(response.data.user);
      }
    } catch (error) {
      Alert.alert('Authentication Failed', error.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.gradientBg} />
        
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>💰</Text>
          </View>
          <Text style={styles.appName}>Finance Companion</Text>
          <Text style={styles.tagline}>Smart Money Management</Text>
        </View>

        <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]} 
              onPress={() => !isLogin && switchMode()}>
              <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, isLogin && styles.toggleButtonActive]} 
              onPress={() => isLogin && switchMode()}>
              <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.formSubtitle}>
            {isLogin ? 'Sign in to continue' : 'Get started with your financial journey'}
          </Text>

          {!isLogin && (
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputIconContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="John Doe"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputIconContainer}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.inputField}
                placeholder="you@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputIconContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.inputField}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit} 
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.socialButton} 
            onPress={handleGoogleSignIn}
            disabled={googleLoading}>
            {googleLoading ? (
              <ActivityIndicator color="#4361ee" />
            ) : (
              <>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.socialText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={switchMode} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.switchLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to our</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Terms of Service</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ========== SPENDING CHART ==========
function SpendingChart({ expenses }) {
  const categoryTotals = {};
  expenses.forEach(exp => { categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount; });
  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const colors = ['#4361ee', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>📊 Spending by Category</Text>
      {sorted.length > 0 ? sorted.map(([cat, amt], i) => {
        const percent = total > 0 ? ((amt / total) * 100).toFixed(1) : 0;
        return (
          <View key={cat} style={styles.chartRow}>
            <View style={styles.chartLabelRow}>
              <View style={[styles.chartDot, { backgroundColor: colors[i % colors.length] }]} />
              <Text style={styles.chartLabel}>{cat}</Text>
              <Text style={styles.chartPercent}>{percent}%</Text>
            </View>
            <View style={styles.chartBarContainer}>
              <View style={[styles.chartBar, { width: `${percent}%`, backgroundColor: colors[i % colors.length] }]} />
            </View>
            <Text style={styles.chartAmount}>₹{amt}</Text>
          </View>
        );
      }) : <Text style={styles.emptyText}>Add expenses to see chart</Text>}
    </View>
  );
}

// ========== INSIGHTS SCREEN ==========
function InsightsScreen({ transactions, totalIncome, totalExpense }) {
  const [period, setPeriod] = useState('all');
  const filtered = transactions.filter(t => {
    if (period === 'week') {
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(t.date) >= weekAgo;
    }
    if (period === 'month') {
      const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(t.date) >= monthAgo;
    }
    return true;
  });
  const expenses = filtered.filter(t => t.type === 'expense');
  const catTotals = {};
  expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
  const topCat = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b, 'None');
  
  const now = new Date();
  const oneWeekAgo = new Date(now); oneWeekAgo.setDate(now.getDate() - 7);
  const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(now.getDate() - 14);
  const thisWeek = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= oneWeekAgo).reduce((s, t) => s + t.amount, 0);
  const lastWeek = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo).reduce((s, t) => s + t.amount, 0);
  const change = lastWeek > 0 ? (((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1) : (thisWeek > 0 ? 100 : 0);

  return (
    <View style={styles.insightsContainer}>
      <View style={styles.periodSelector}>
        {['all', 'week', 'month'].map(p => (
          <TouchableOpacity key={p} style={[styles.periodBtn, period === p && styles.periodBtnActive]} onPress={() => setPeriod(p)}>
            <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>{p === 'all' ? 'All Time' : p === 'week' ? '7 Days' : '30 Days'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.insightCard}><Text style={styles.insightLabel}>💰 Total Income</Text><Text style={[styles.insightValue, { color: '#10b981' }]}>₹{totalIncome.toFixed(2)}</Text></View>
      <View style={styles.insightCard}><Text style={styles.insightLabel}>💸 Total Expenses</Text><Text style={[styles.insightValue, { color: '#ef4444' }]}>₹{totalExpense.toFixed(2)}</Text></View>
      <View style={styles.insightCard}><Text style={styles.insightLabel}>🏆 Top Category</Text><Text style={styles.insightValue}>{topCat}</Text><Text style={styles.insightSub}>₹{catTotals[topCat] || 0}</Text></View>
      <View style={styles.insightCard}><Text style={styles.insightLabel}>📈 Week Trend</Text><Text style={[styles.insightValue, { color: change <= 0 ? '#10b981' : '#ef4444' }]}>{change >= 0 ? `+${change}%` : `${change}%`}</Text><Text style={styles.insightSub}>This week: ₹{thisWeek} | Last: ₹{lastWeek}</Text></View>
      <View style={styles.insightCard}><Text style={styles.insightLabel}>📝 Total Transactions</Text><Text style={styles.insightValue}>{filtered.length}</Text></View>
    </View>
  );
}

// ========== GOALS SCREEN ==========
function GoalsScreen({ balance, streak, onUpdateStreak }) {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const monthlyGoal = 10000;
  const progress = Math.min((balance / monthlyGoal) * 100, 100);

  const addGoal = () => {
    if (!title || !target) { Alert.alert('Error', 'Fill all fields'); return; }
    setGoals([...goals, { id: Date.now(), title, targetAmount: parseFloat(target), currentAmount: 0, completed: false }]);
    setTitle(''); setTarget(''); setShowModal(false);
    Alert.alert('Success', 'Goal created!');
  };

  const updateProgress = (id, amt) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const newAmt = g.currentAmount + amt;
        if (newAmt >= g.targetAmount) Alert.alert('🎉 Congrats!', `Completed "${g.title}"!`);
        return { ...g, currentAmount: newAmt, completed: newAmt >= g.targetAmount };
      }
      return g;
    }));
  };

  return (
    <View style={styles.goalsContainer}>
      <View style={styles.monthlyCard}>
        <Text style={styles.monthlyTitle}>🎯 Monthly Savings Goal</Text>
        <Text style={styles.monthlyTarget}>₹{monthlyGoal}</Text>
        <View style={styles.progressContainer}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.monthlyProgress}>{progress.toFixed(1)}% Complete</Text>
      </View>
      <View style={styles.streakCard}>
        <Text style={styles.streakTitle}>🔥 Saving Streak</Text>
        <Text style={styles.streakCount}>{streak} Days</Text>
        <TouchableOpacity style={styles.streakBtn} onPress={onUpdateStreak}><Text style={styles.streakBtnText}>+1 Day</Text></TouchableOpacity>
      </View>
      <View style={styles.goalsHeader}><Text style={styles.sectionTitle}>Custom Goals</Text><TouchableOpacity style={styles.addGoalBtn} onPress={() => setShowModal(true)}><Text style={styles.addGoalBtnText}>+ Add Goal</Text></TouchableOpacity></View>
      {goals.length === 0 ? <View style={styles.emptyGoal}><Text style={styles.emptyText}>No goals yet. Create one!</Text></View> : goals.map(g => {
        const p = (g.currentAmount / g.targetAmount) * 100;
        return (<View key={g.id} style={styles.goalCard}><Text style={styles.goalTitle}>{g.title}{g.completed && ' ✓'}</Text><Text style={styles.goalAmount}>₹{g.currentAmount} / ₹{g.targetAmount}</Text><View style={styles.progressContainer}><View style={[styles.progressFill, { width: `${Math.min(p, 100)}%`, backgroundColor: '#8b5cf6' }]} /></View><Text style={styles.goalProgress}>{p.toFixed(1)}%</Text>{!g.completed && <View style={styles.progressBtns}><TouchableOpacity onPress={() => updateProgress(g.id, 100)}><Text style={styles.progressBtn}>+100</Text></TouchableOpacity><TouchableOpacity onPress={() => updateProgress(g.id, 500)}><Text style={styles.progressBtn}>+500</Text></TouchableOpacity><TouchableOpacity onPress={() => updateProgress(g.id, 1000)}><Text style={styles.progressBtn}>+1000</Text></TouchableOpacity></View>}</View>);
      })}
      <Modal visible={showModal} transparent animationType="slide"><View style={styles.modalOverlay}><View style={styles.modalCard}><Text style={styles.modalTitle}>Create Goal</Text><TextInput style={styles.input} placeholder="Goal Title" value={title} onChangeText={setTitle} /><TextInput style={styles.input} placeholder="Target Amount" value={target} onChangeText={setTarget} keyboardType="numeric" /><View style={styles.modalBtns}><TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}><Text>Cancel</Text></TouchableOpacity><TouchableOpacity style={styles.createBtn} onPress={addGoal}><Text style={{ color: '#fff' }}>Create</Text></TouchableOpacity></View></View></View></Modal>
    </View>
  );
}

// ========== ADD TRANSACTION MODAL ==========
function AddModal({ visible, onClose, onAdd, editTx }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [desc, setDesc] = useState('');
  useEffect(() => { if (editTx) { setAmount(editTx.amount.toString()); setType(editTx.type); setCategory(editTx.category); setDesc(editTx.description || ''); } else { setAmount(''); setType('expense'); setCategory(CATEGORIES[0]); setDesc(''); } }, [editTx, visible]);
  const submit = () => { if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Valid amount required'); return; } onAdd({ amount: parseFloat(amount), type, category, description: desc, date: new Date().toISOString() }); onClose(); };
  return (<Modal visible={visible} transparent animationType="slide"><View style={styles.modalOverlay}><View style={styles.modalCard}><Text style={styles.modalTitle}>{editTx ? 'Edit' : 'Add'} Transaction</Text><View style={styles.typeRow}><TouchableOpacity style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]} onPress={() => setType('expense')}><Text>💸 Expense</Text></TouchableOpacity><TouchableOpacity style={[styles.typeBtn, type === 'income' && styles.typeBtnActive]} onPress={() => setType('income')}><Text>💰 Income</Text></TouchableOpacity></View><TextInput style={styles.input} placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" /><ScrollView horizontal><View style={styles.categoryRow}>{CATEGORIES.map(c => <TouchableOpacity key={c} style={[styles.categoryChip, category === c && styles.categoryChipActive]} onPress={() => setCategory(c)}><Text>{c}</Text></TouchableOpacity>)}</View></ScrollView><TextInput style={styles.input} placeholder="Description" value={desc} onChangeText={setDesc} /><View style={styles.modalBtns}><TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text>Cancel</Text></TouchableOpacity><TouchableOpacity style={styles.createBtn} onPress={submit}><Text style={{ color: '#fff' }}>Save</Text></TouchableOpacity></View></View></View></Modal>);
}

// ========== MAIN DASHBOARD ==========
function DashboardScreen({ onLogout }) {
  const [txs, setTxs] = useState([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { onLogout(); return; }
      API.defaults.headers['x-auth-token'] = token;
      const res = await API.get('/transactions');
      const data = res.data || [];
      setTxs(data);
      let inc = 0, exp = 0;
      data.forEach(t => { if (t.type === 'income') inc += t.amount; else exp += t.amount; });
      setIncome(inc); setExpense(exp); setBalance(inc - exp);
    } catch (err) { if (err.response?.status === 401) onLogout(); }
  };

  const saveTx = async (tx) => {
    try {
      if (editTx) await API.put(`/transactions/${editTx.id}`, tx);
      else await API.post('/transactions', tx);
      fetchData(); setEditTx(null);
      Alert.alert('Success', `Transaction ${editTx ? 'updated' : 'added'}!`);
    } catch (err) { Alert.alert('Error', 'Failed to save'); }
  };

  const delTx = (id) => { Alert.alert('Confirm', 'Delete?', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await API.delete(`/transactions/${id}`); fetchData(); } }]); };

  const updateStreak = () => { setStreak(streak + 1); Alert.alert('🔥 Streak!', `${streak + 1} days!`); };

  useEffect(() => { fetchData(); }, []);

  const filtered = txs.filter(t => (t.description || t.category || '').toLowerCase().includes(search.toLowerCase()) && (filter === 'all' || t.type === filter));

  const monthlyGoal = 10000;
  const saveProgress = Math.min((balance / monthlyGoal) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.logo}>💰 Finance Companion</Text><TouchableOpacity onPress={onLogout} style={styles.logoutBtn}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity></View>
      <View style={styles.tabBar}><TouchableOpacity style={[styles.tab, tab === 'dashboard' && styles.tabActive]} onPress={() => setTab('dashboard')}><Text>📊 Dashboard</Text></TouchableOpacity><TouchableOpacity style={[styles.tab, tab === 'insights' && styles.tabActive]} onPress={() => setTab('insights')}><Text>📈 Insights</Text></TouchableOpacity><TouchableOpacity style={[styles.tab, tab === 'goals' && styles.tabActive]} onPress={() => setTab('goals')}><Text>🎯 Goals</Text></TouchableOpacity></View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'dashboard' && (<>
          <View style={styles.balanceCard}><Text style={styles.balanceLabel}>Current Balance</Text><Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text><View style={styles.statsRow}><View><Text style={styles.statLabel}>Income</Text><Text style={[styles.statValue, { color: '#10b981' }]}>₹{income}</Text></View><View><Text style={styles.statLabel}>Expense</Text><Text style={[styles.statValue, { color: '#ef4444' }]}>₹{expense}</Text></View></View></View>
          <View style={styles.savingsCard}><Text style={styles.cardTitle}>🎯 Monthly Savings</Text><View style={styles.progressContainer}><View style={[styles.progressFill, { width: `${saveProgress}%` }]} /></View><Text style={styles.progressText}>{saveProgress.toFixed(1)}% of ₹{monthlyGoal}</Text></View>
          <SpendingChart expenses={txs.filter(t => t.type === 'expense')} />
          <TouchableOpacity style={styles.addBtn} onPress={() => { setEditTx(null); setModal(true); }}><Text style={styles.addBtnText}>+ Add Transaction</Text></TouchableOpacity>
          <View style={styles.searchSection}><TextInput style={styles.searchInput} placeholder="🔍 Search..." value={search} onChangeText={setSearch} /><View style={styles.filterRow}><TouchableOpacity style={[styles.filterChip, filter === 'all' && styles.filterActive]} onPress={() => setFilter('all')}><Text>All</Text></TouchableOpacity><TouchableOpacity style={[styles.filterChip, filter === 'income' && styles.filterActive]} onPress={() => setFilter('income')}><Text>Income</Text></TouchableOpacity><TouchableOpacity style={[styles.filterChip, filter === 'expense' && styles.filterActive]} onPress={() => setFilter('expense')}><Text>Expense</Text></TouchableOpacity></View></View>
          <View style={styles.txSection}><Text style={styles.sectionTitle}>Transactions</Text>{filtered.length === 0 ? <Text style={styles.emptyText}>No transactions</Text> : filtered.map(t => (<View key={t.id} style={styles.txItem}><TouchableOpacity style={{ flex: 1 }} onPress={() => { setEditTx(t); setModal(true); }}><Text style={styles.txDesc}>{t.description || t.category}</Text><Text style={styles.txDate}>{new Date(t.date).toLocaleDateString()}</Text></TouchableOpacity><Text style={[styles.txAmount, { color: t.type === 'income' ? '#10b981' : '#ef4444' }]}>{t.type === 'income' ? '+' : '-'}₹{t.amount}</Text><TouchableOpacity onPress={() => delTx(t.id)}><Text style={styles.deleteIcon}>🗑️</Text></TouchableOpacity></View>))}</View>
        </>)}
        {tab === 'insights' && <InsightsScreen transactions={txs} totalIncome={income} totalExpense={expense} />}
        {tab === 'goals' && <GoalsScreen balance={balance} streak={streak} onUpdateStreak={updateStreak} />}
      </ScrollView>
      <AddModal visible={modal} onClose={() => { setModal(false); setEditTx(null); }} onAdd={saveTx} editTx={editTx} />
    </View>
  );
}

// ========== MAIN APP ==========
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { const token = localStorage.getItem('token'); if (token) { setLoggedIn(true); API.defaults.headers['x-auth-token'] = token; } }, []);
  return loggedIn ? <DashboardScreen onLogout={() => setLoggedIn(false)} /> : <AuthScreen onLogin={() => setLoggedIn(true)} />;
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#f0f4f8' },
  authScroll: { flexGrow: 1 },
  gradientBg: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.4, backgroundColor: '#4361ee' },
  logoSection: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  logoEmoji: { fontSize: 40 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 16 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  formCard: { backgroundColor: '#fff', borderRadius: 24, marginHorizontal: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleButtonActive: { backgroundColor: '#4361ee' },
  toggleText: { fontSize: 16, fontWeight: '500', color: '#64748b' },
  toggleTextActive: { color: '#fff' },
  formTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  formSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  inputWrapper: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 8 },
  inputIconContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#f8fafc' },
  inputIcon: { fontSize: 18, marginRight: 8 },
  inputField: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#1e293b' },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: '#4361ee', fontSize: 14 },
  submitButton: { backgroundColor: '#4361ee', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { marginHorizontal: 16, color: '#94a3b8', fontSize: 12 },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingVertical: 14, marginBottom: 20, backgroundColor: '#fff' },
  googleIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#4361ee', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  googleIconText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  socialText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  switchButton: { alignItems: 'center' },
  switchText: { fontSize: 14, color: '#64748b' },
  switchLink: { color: '#4361ee', fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  footerText: { fontSize: 12, color: '#94a3b8' },
  footerLinks: { flexDirection: 'row', marginTop: 4 },
  footerLink: { fontSize: 12, color: '#4361ee' },
  footerDot: { fontSize: 12, color: '#94a3b8', marginHorizontal: 6 },
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  logo: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fee2e2', borderRadius: 8 },
  logoutText: { color: '#ef4444', fontSize: 12, fontWeight: '500' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  tabActive: { backgroundColor: '#e0e7ff' },
  balanceCard: { backgroundColor: '#4361ee', margin: 16, padding: 24, borderRadius: 20 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center' },
  balanceAmount: { color: '#fff', fontSize: 44, fontWeight: 'bold', textAlign: 'center', marginVertical: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 4 },
  savingsCard: { backgroundColor: '#fff', margin: 16, marginTop: 0, padding: 20, borderRadius: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  progressContainer: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: '#4361ee' },
  progressText: { fontSize: 12, color: '#64748b', marginTop: 8, textAlign: 'right' },
  chartContainer: { backgroundColor: '#fff', margin: 16, marginTop: 0, padding: 20, borderRadius: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 16 },
  chartRow: { marginBottom: 16 },
  chartLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  chartDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  chartLabel: { flex: 1, fontSize: 14, color: '#334155' },
  chartPercent: { fontSize: 12, color: '#64748b' },
  chartBarContainer: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  chartBar: { height: 8, borderRadius: 4 },
  chartAmount: { fontSize: 12, color: '#64748b', marginTop: 4, textAlign: 'right' },
  addBtn: { backgroundColor: '#10b981', margin: 16, marginTop: 0, padding: 16, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  searchSection: { backgroundColor: '#fff', margin: 16, marginTop: 0, padding: 16, borderRadius: 16 },
  searchInput: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#f8fafc' },
  filterRow: { flexDirection: 'row', marginTop: 12 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f1f5f9', borderRadius: 20, marginRight: 10 },
  filterActive: { backgroundColor: '#4361ee' },
  txSection: { backgroundColor: '#fff', margin: 16, marginTop: 0, padding: 20, borderRadius: 16 },
  txItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  txDesc: { fontSize: 16, fontWeight: '500', color: '#1e293b' },
  txDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: '600', marginRight: 12 },
  deleteIcon: { fontSize: 18, color: '#94a3b8' },
  emptyText: { textAlign: 'center', color: '#94a3b8', padding: 24 },
  insightsContainer: { padding: 16 },
  periodSelector: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  periodBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff', borderRadius: 10 },
  periodBtnActive: { backgroundColor: '#4361ee' },
  periodBtnText: { color: '#64748b', fontSize: 12 },
  periodBtnTextActive: { color: '#fff' },
  insightCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 12 },
  insightLabel: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  insightValue: { fontSize: 32, fontWeight: 'bold' },
  insightSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  goalsContainer: { padding: 16 },
  monthlyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 12 },
  monthlyTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  monthlyTarget: { fontSize: 24, fontWeight: 'bold', color: '#4361ee', marginVertical: 8 },
  monthlyProgress: { fontSize: 12, color: '#64748b', marginTop: 8, textAlign: 'right' },
  streakCard: { backgroundColor: '#f59e0b', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 12 },
  streakTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  streakCount: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginVertical: 8 },
  streakBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  streakBtnText: { color: '#f59e0b', fontWeight: '600' },
  goalsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  addGoalBtn: { backgroundColor: '#8b5cf6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addGoalBtnText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  emptyGoal: { backgroundColor: '#fff', borderRadius: 16, padding: 40, alignItems: 'center' },
  goalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 12 },
  goalTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  goalAmount: { fontSize: 14, color: '#64748b', marginVertical: 8 },
  goalProgress: { fontSize: 12, color: '#8b5cf6', marginTop: 8, textAlign: 'right' },
  progressBtns: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  progressBtn: { backgroundColor: '#8b5cf6', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, color: '#fff', fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: width * 0.9 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 20, textAlign: 'center' },
  typeRow: { flexDirection: 'row', marginBottom: 16, gap: 12 },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10 },
  typeBtnActive: { backgroundColor: '#4361ee' },
  categoryRow: { flexDirection: 'row', marginBottom: 16 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f1f5f9', borderRadius: 20, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#4361ee' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 14, fontSize: 14, marginBottom: 16, backgroundColor: '#f8fafc' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 14, backgroundColor: '#f1f5f9', borderRadius: 10, alignItems: 'center' },
  createBtn: { flex: 1, paddingVertical: 14, backgroundColor: '#4361ee', borderRadius: 10, alignItems: 'center' },
});