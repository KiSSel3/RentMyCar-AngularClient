export interface CreateBookingRequestDTO {
  userId: string;
  rentOfferId: string;
  rentalStart: string;
  rentalEnd: string;
  message?: string;
}
