import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from "../globalstyles";




const Calendar = ({ rideDates }: { rideDates: string[] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentMonth);

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const isRideDay = (day: number) => {
        const dateStr = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
        return rideDates.includes(dateStr);
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    return (
        <View>
            <View style={styles.monthHeader}>
                <TouchableOpacity onPress={goToPreviousMonth}>
                    <Text style={styles.monthNavigation}>&lt;</Text>
                </TouchableOpacity>
                <Text style={styles.monthYearText}>{`${currentMonth.toLocaleString('default', { month: 'long' })} ${currentMonth.getFullYear()}`}</Text>
                <TouchableOpacity onPress={goToNextMonth}>
                    <Text style={styles.monthNavigation}>&gt;</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.calendarContainer}>
                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const isRide = isRideDay(day);
                    return (
                        <View key={day} style={[styles.dayCell, isRide ? styles.rideDay : null]}>
                            <Text style={styles.dayText}>{day}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
  
  const styles = StyleSheet.create({
    calendarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1, // Add border for the outer outline
        borderColor: 'white', // Border color
        borderRadius: 10, // Optional for rounded corners
    },
    dayCell: {
        width: `${100 / 7}%`, // 7 days in a week
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1, // Add right border to each cell
        borderBottomWidth: 1, // Add bottom border to each cell
        borderColor: 'white', // Border color
    },
    dayText: {
        fontSize: 16,
        color: 'white', // Adjust as needed
    },
    rideDay: {
        backgroundColor: Colors.gold,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    monthNavigation: {
        fontSize: 48,
        color: 'white',
    },
    monthYearText: {
        fontSize: 18,
        color: 'white',
    },
  });
  
  export default Calendar;