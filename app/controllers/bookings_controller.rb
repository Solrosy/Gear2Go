class BookingsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:show, :create]

  def index
    @bookings = current_user.booked_gears.upcoming
  end

  def create
    @gear = Gear.find(params[:gear_id])
    # date = DateTime.parse(params[:slot]) || DateTime.now
    # @available_slots = @gear.available_slots_for_day(date)

    # Find or create the user
    @user = User.find_or_initialize_by(email: booking_params[:email])
    if @user.new_record?
      @user.first_name = booking_params[:first_name]
      @user.last_name = booking_params[:last_name]
      @user.password = SecureRandom.hex(10) # or a hardcoded password
      @user.save!
    end

    # Create the booking
    @booking = @gear.bookings.new(booking_params.except(:first_name, :last_name, :email, :date, :slot))
    @booking.start_time = DateTime.parse(params[:slot])
    @booking.user = @user
    @booking.total_price = @gear.hourly_rate

    begin
      if @booking.save
        redirect_to gear_booking_path(@gear, @booking)
      else
        flash[:error] = @booking.errors.full_messages.join(", ")
        render 'gears/show'
      end
    rescue => e
      Rails.logger.error "Error in BookingsController#create: #{e.message}"
      flash[:error] = "Something went wrong. Please try again."
      render 'gears/show'
    end
  end

  def show
    @booking = Booking.find(params[:id])
  end

  private

  def booking_params
    params.require(:booking).permit(:first_name, :last_name, :email, :date, :slot)
  end
end
