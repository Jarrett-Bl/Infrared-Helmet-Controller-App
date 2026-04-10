import { AppColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { styles } from "../../styles/sharedStyles";

type ResourceLink = {
  id: string;
  label: string;
  description: string;
  url: string;
};

const RESOURCE_LINKS: ResourceLink[] = [
  {
    id: "1", 
    label: "Bhakti Wellness Website", 
    description: "Contact your provider", 
    url: "https://bhakticlinic.com/contact-us/",
  }, 
  {
    id: "2", 
    label: "Manufacturer Website", 
    description: "Cozing Medical Helmet Website", 
    url: "https://www.cozingmedical.com/brain-rehab-helmet/75.html",
  }
];

export default function ResourcePage() {
  const handlePress = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Resources</Text>

      {RESOURCE_LINKS.length === 0 && (
        <Text style={styles.emptyText}>No resources added yet.</Text>
      )}

      {RESOURCE_LINKS.map((item) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            resourceStyles.card,
            pressed && resourceStyles.cardPressed,
            Platform.select({ android: styles.cardElevated }),
          ]}
          onPress={() => handlePress(item.url)}
          accessibilityRole="link"
          accessibilityLabel={item.label}
          testID={`btn-resource-${item.id}`}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.label}</Text>
            <Text style={styles.cardSub}>{item.description}</Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={AppColors.textMuted}
          />
        </Pressable>
      ))}
    </View>
  );
}

const resourceStyles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.75,
  },
});