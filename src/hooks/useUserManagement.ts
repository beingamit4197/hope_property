import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "./useAuth";

export interface UserManagementFilters {
  role?: "user" | "agent" | "admin";
  isVerified?: boolean;
  searchTerm?: string;
  limit?: number;
}

export interface UserManagementResult {
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  lastDoc: DocumentSnapshot | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useUserManagement(filters: UserManagementFilters = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const buildQuery = (startAfterDoc?: DocumentSnapshot) => {
    const constraints: QueryConstraint[] = [];

    if (filters.role) {
      constraints.push(where("role", "==", filters.role));
    }

    if (filters.isVerified !== undefined) {
      constraints.push(where("isVerified", "==", filters.isVerified));
    }

    constraints.push(orderBy("createdAt", "desc"));
    constraints.push(limit(filters.limit || 20));

    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc));
    }

    return query(collection(db, "users"), ...constraints);
  };

  const fetchUsers = async (
    startAfterDoc?: DocumentSnapshot,
    append = false
  ) => {
    try {
      setLoading(true);
      setError(null);

      const q = buildQuery(startAfterDoc);
      const snapshot = await getDocs(q);

      const newUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as User[];

      if (append) {
        setUsers((prev) => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === (filters.limit || 20));

      // Apply search filter if provided
      if (filters.searchTerm) {
        const filteredUsers = newUsers.filter(
          (user) =>
            user.name
              .toLowerCase()
              .includes(filters.searchTerm!.toLowerCase()) ||
            user.email
              .toLowerCase()
              .includes(filters.searchTerm!.toLowerCase()) ||
            (user.phone && user.phone.includes(filters.searchTerm!))
        );

        if (append) {
          setUsers((prev) => {
            const existing = prev.filter(
              (u) => !newUsers.some((nu) => nu.id === u.id)
            );
            return [...existing, ...filteredUsers];
          });
        } else {
          setUsers(filteredUsers);
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    setUsers([]);
    setLastDoc(null);
    setHasMore(true);
    await fetchUsers();
  };

  const loadMore = async () => {
    if (hasMore && lastDoc && !loading) {
      await fetchUsers(lastDoc, true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.role, filters.isVerified, filters.searchTerm]);

  return {
    users,
    loading,
    error,
    hasMore,
    lastDoc,
    refetch,
    loadMore,
  };
}

export function useUserStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    agents: 0,
    admins: 0,
    recentSignups: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        totalSnapshot,
        verifiedSnapshot,
        agentsSnapshot,
        adminsSnapshot,
        recentSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(
          query(collection(db, "users"), where("isVerified", "==", true))
        ),
        getDocs(query(collection(db, "users"), where("role", "==", "agent"))),
        getDocs(query(collection(db, "users"), where("role", "==", "admin"))),
        getDocs(
          query(
            collection(db, "users"),
            where(
              "createdAt",
              ">=",
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            )
          )
        ),
      ]);

      setStats({
        totalUsers: totalSnapshot.size,
        verifiedUsers: verifiedSnapshot.size,
        agents: agentsSnapshot.size,
        admins: adminsSnapshot.size,
        recentSignups: recentSnapshot.size,
      });
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
