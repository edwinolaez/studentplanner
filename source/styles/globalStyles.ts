import { StyleSheet } from "react-native";
import { COLORS } from "./colors";
import { TYPO } from "./typo";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  ScreenContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: TYPO.sizes.heading,
    fontWeight: TYPO.weights.semibold,
    color: COLORS.textPrimary
  },
  body: {
    fontSize: TYPO.sizes.body,
    fontWeight: TYPO.weights.normal,
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
}); 