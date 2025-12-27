import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
  value?: string;                 // YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  maximumDate?: Date;
};

const DatePickerInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Tarih Seç",
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date();

  const handleChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowPicker(false);

    if (event.type === "dismissed" || !selectedDate) return;

    if (maximumDate && selectedDate > maximumDate) return;

    const formattedDate = selectedDate
      .toISOString()
      .split("T")[0];

    onChange(formattedDate);
  };

  return (
    <View>
      {/* INPUT GÖRÜNÜMÜ */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.text,
            { color: value ? "#000" : "#999" },
          ]}
        >
          {value || placeholder}
        </Text>

        {/* 📅 ICON */}
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#999"
        />
      </TouchableOpacity>

      {/* DATE PICKER */}
      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : today}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DatePickerInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
  },
});
