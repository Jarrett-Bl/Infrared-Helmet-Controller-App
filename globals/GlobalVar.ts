export interface GlobalState {
  userRole:  'user' | 'admin';
  isAuthenticated: boolean;
}

export const GlobalVar: GlobalState = {
  userRole: 'user',
  isAuthenticated: false,
}; 

// For Users
export const setUserMode = () => {
  GlobalVar.userRole = 'user';
  GlobalVar.isAuthenticated = false;
  console.log('GlobalVar: Set to User mode');
}; 


// For admin
export const setAdminMode = () => {
  GlobalVar.userRole = 'admin';
  GlobalVar.isAuthenticated = true;
  console.log('GlobalVar: Set to Admin mode');
}; 


// Helpers
export const isAdmin = () => GlobalVar.userRole === 'admin';
export const isUser = () => GlobalVar.userRole === 'user';
export const getCurrentRole = () => GlobalVar.userRole;
export const getAuthStatus = () => GlobalVar.isAuthenticated; 


// Logs the state for debug
export const logGlobalState = () => {
  console.log('GlobalVar State:', {
    role: GlobalVar.userRole,
    authenticated: GlobalVar.isAuthenticated,
  });
};