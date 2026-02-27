import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Column, Host, ModalBottomSheet, Text, Picker } from "@expo/ui/jetpack-compose";
import { paddingAll } from "@expo/ui/jetpack-compose/modifiers";

export default function Profile() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const colorLabels = ["Red", "Orange", "Green", "Blue"];
  const colorValues = ["red", "orange", "green", "blue"];
  return (
    <View style={styles.container}>
      <Host matchContents>
        <Button variant="elevated" onPress={() => setIsBottomSheetOpen(true)}>
          Open Bottom Sheet
        </Button>

        {isBottomSheetOpen && (
          <ModalBottomSheet onDismissRequest={() => setIsBottomSheetOpen(false)}>
            <Column
              verticalArrangement={{ spacedBy: 12 }}
              modifiers={[paddingAll(24)]}
            >
              <Picker
                options={colorLabels}
                selectedIndex={selectedIndex}
                onOptionSelected={({ nativeEvent: { index } }) => {
                  setSelectedIndex(index);
                }}
                variant="segmented"
                color="yellow"
              />
              <Text color={colorValues[selectedIndex]}>Profile</Text>
              <Text>This is the content of the bottom sheet.</Text>
              <Button onPress={() => setIsBottomSheetOpen(false)}>
                Close
              </Button>
            </Column>
          </ModalBottomSheet>
        )}
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
