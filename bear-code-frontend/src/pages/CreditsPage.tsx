import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Coins, TrendingUp, TrendingDown, Loader2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CreditTransaction, PaginatedResponse } from '../types';

export const CreditsPage: React.FC = () => {
  const { user, updateCredits } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [amount, setAmount] = useState(100);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await apiService.getCreditTransactions(1, 20);
      const data = response.data as PaginatedResponse<CreditTransaction>;
      setTransactions(data.data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await apiService.purchaseCredits(amount, 'credit_card');
      toast.success(`Successfully purchased ${amount} credits!`);
      
      // Update user credits
      const balance = await apiService.getCreditBalance();
      updateCredits(balance.data!.balance);
      
      // Reload transactions
      await loadTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
      case 'bonus':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'usage':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'refund':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <Coins className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
      case 'bonus':
        return 'text-green-600';
      case 'usage':
        return 'text-red-600';
      case 'refund':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credits</h1>
          <p className="text-gray-600 mt-2">
            Manage your credits and view transaction history
          </p>
        </div>

        {/* Current Balance */}
        <div className="card bg-gradient-to-r from-bear-500 to-bear-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-bear-100 mb-2">Current Balance</p>
              <p className="text-5xl font-bold">{user?.credits || 0}</p>
              <p className="text-bear-100 mt-2">credits available</p>
            </div>
            <Coins className="w-20 h-20 text-bear-200" />
          </div>
        </div>

        {/* Purchase Credits */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Purchase Credits</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="flex space-x-2">
                {[50, 100, 250, 500].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      amount === value
                        ? 'bg-bear-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="input"
                min="1"
                max="10000"
              />
            </div>

            <div className="bg-bear-50 border border-bear-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Credits</span>
                <span className="font-semibold">{amount}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Price per credit</span>
                <span className="font-semibold">$0.01</span>
              </div>
              <div className="border-t border-bear-200 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-bear-600">
                    ${(amount * 0.01).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchasing || amount < 1}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              {purchasing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Purchase {amount} Credits
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-bear-600" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Balance: {transaction.balanceAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credit Costs */}
        <div className="card bg-blue-50 border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Credit Costs</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Index Code</span>
              <span className="font-semibold text-blue-600">1 credit</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Search Code</span>
              <span className="font-semibold text-blue-600">2 credits</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Code Generation</span>
              <span className="font-semibold text-blue-600">5 credits</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
