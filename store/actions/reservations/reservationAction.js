
export const addReservation = (reservation) => {
    return {
        type: 'ADD_RESERVATION',
        reservation,
    }
};

export const fetchReservations = (reservationList) => {
    return {
        type: 'FETCH_RESERVATIONS',
        reservationList,
    }
};