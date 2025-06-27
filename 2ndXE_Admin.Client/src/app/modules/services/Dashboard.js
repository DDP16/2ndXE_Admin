import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../supabase";

// Thống kê tổng số người dùng
export const fetchUserCount = createAsyncThunk(
  "dashboard/fetchUserCount",
  async (_, { rejectWithValue }) => {
    try {
      const { count, error } = await supabase
        .from("User")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      return count;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thống kê tổng số bài đăng
export const fetchPostCount = createAsyncThunk(
  "dashboard/fetchPostCount",
  async (_, { rejectWithValue }) => {
    try {
      const { count, error } = await supabase
        .from("VehiclePost")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      return count;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thống kê tổng doanh thu
export const fetchTotalProfit = createAsyncThunk(
  "dashboard/fetchTotalProfit",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("PostPayment")
        .select("total_price")
        .eq("status", "paid");

      if (error) throw error;

      // Tính tổng doanh thu
      const totalProfit = data.reduce((sum, payment) => sum + (payment.total_price || 0), 0);

      return totalProfit;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Lấy dữ liệu biểu đồ lợi nhuận theo thời gian
export const fetchProfitChartData = createAsyncThunk(
  "dashboard/fetchProfitChartData",
  async (_, { rejectWithValue }) => {
    try {
      // Lấy dữ liệu thanh toán của 30 ngày gần nhất
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("PostPayment")
        .select("created_at, total_price")
        .eq("status", "paid")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Xử lý dữ liệu theo ngày
      const dailyData = {};
      
      // Ghi nhận các ngày có dữ liệu
      data.forEach(payment => {
        const date = new Date(payment.created_at);
        const day = date.getDate().toString();
        
        if (!dailyData[day]) {
          dailyData[day] = 0;
        }

        dailyData[day] += payment.total_price || 0;
      });
      
      // Thêm các ngày không có dữ liệu trong khoảng 30 ngày với giá trị 0
      const currentDate = new Date();
      for (let i = 30; i >= 1; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        const day = date.getDate().toString();
        
        // Chỉ thêm ngày chưa có trong dailyData
        if (!dailyData[day]) {
          dailyData[day] = 0;
        }
      }
      
      // Chuyển đổi sang định dạng cho biểu đồ
      const chartData = Object.entries(dailyData).map(([name, value]) => ({
        name,
        value
      }));
      
      // Sắp xếp theo thứ tự ngày tăng dần
      chartData.sort((a, b) => parseInt(a.name) - parseInt(b.name));
      
      return chartData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Lấy tất cả dữ liệu Dashboard cùng lúc
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { dispatch }) => {
    const userCount = await dispatch(fetchUserCount());
    const postCount = await dispatch(fetchPostCount());
    const totalProfit = await dispatch(fetchTotalProfit());
    const chartData = await dispatch(fetchProfitChartData());
    
    return {
      userCount: userCount.payload,
      postCount: postCount.payload,
      totalProfit: totalProfit.payload,
      chartData: chartData.payload
    };
  }
);

// Tạo Redux slice cho Dashboard
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    userCount: 0,
    postCount: 0,
    totalProfit: 0,
    chartData: [],
    loading: false,
    error: null,
    lastUpdated: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý fetchUserCount
      .addCase(fetchUserCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCount.fulfilled, (state, action) => {
        state.userCount = action.payload;
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserCount.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Xử lý fetchPostCount
      .addCase(fetchPostCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostCount.fulfilled, (state, action) => {
        state.postCount = action.payload;
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPostCount.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Xử lý fetchTotalProfit
      .addCase(fetchTotalProfit.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalProfit.fulfilled, (state, action) => {
        state.totalProfit = action.payload;
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTotalProfit.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Xử lý fetchProfitChartData
      .addCase(fetchProfitChartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfitChartData.fulfilled, (state, action) => {
        state.chartData = action.payload;
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchProfitChartData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Xử lý fetchDashboardData
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.userCount = action.payload.userCount;
        state.postCount = action.payload.postCount;
        state.totalProfit = action.payload.totalProfit;
        state.chartData = action.payload.chartData;
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      });
  }
});

export default dashboardSlice.reducer;
