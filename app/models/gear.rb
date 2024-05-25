class Gear < ApplicationRecord
  belongs_to :user
  has_many :bookings, dependent: :destroy
  has_one_attached :photo

  # Calculates the available booking slots for a given date
  # Assumes that all gear is bookable from 9am to 5pm.
  def available_slots_for_day(date)
    # Creates an array of all the booked slots for the given day
    booked_slots = bookings.where('start_time BETWEEN ? AND ?', date.beginning_of_day, date.end_of_day).pluck(:start_time)
    # Creates an array of all the possible slots for the given day
    all_slots = (9..17).map { |hour| date.to_time.change(hour: hour) }
    # Returns the difference between all_slots and booked_slots which are the available slots
    all_slots - booked_slots
  end

  # Returns the next n days with available slots.
  def next_n_days_with_slots(start_date, number_of_days)
    (start_date..start_date + number_of_days).map do |date|
      # Generates a hash with the date and the available slots for that day
      { date: date, slots: available_slots_for_day(date) }
    end
  end

end
