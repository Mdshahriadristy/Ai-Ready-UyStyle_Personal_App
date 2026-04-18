// import React from 'react'
// import { NavigationContainer } from '@react-navigation/native'
// import RootNavigator from './src/navigation/RootNavigator'

// const App = () => {
//   return (
//     <NavigationContainer>
//       <RootNavigator />
//     </NavigationContainer>
//   )
// }

// export default App




import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;