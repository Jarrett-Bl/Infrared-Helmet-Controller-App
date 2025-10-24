import { Redirect } from "expo-router";
import { StyleSheet } from 'react-native';


// export default function HomeScreen() {
//   return (
//   <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 18 }}>
//     <View style={{ width: 260, gap: 12 }}>
//       <Link href="/homeScreen" asChild>
//         <Button title="Helmet Control" />
//       </Link>

//       <Link href="/settings" asChild>
//         <Button title="Settings" />
//       </Link>
//     </View>
//   </View>
//   );
// }
export default function Index() {
  return <Redirect href="/homeScreen" />;
      <Link href="/settings" asChild>
        <Button title="Settings" />
      </Link>

      <Link href="/runPage" asChild>
        <Button title="runPage" />
      </Link>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
