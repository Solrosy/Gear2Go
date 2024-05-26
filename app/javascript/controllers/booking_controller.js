import { Controller } from '@hotwired/stimulus'

// Connects to data-controller="booking"
// Loads the available slots for the current day
export default class extends Controller {
  static targets = ['date', 'timeSelect']
  static values = { slots: Array }

  connect() {
    // Set the first date button to active
    this.dateTargets[0].classList.add('active', 'btn-info');

    // Preload the data with slots for the next 7 days
    this.slots = this.slotsValue

    // Delete the slots with class slot
    document.querySelectorAll('.slot').forEach(slot => slot.remove())

    // Get the slots for the current date which is the first index of the slots array
    this.generateTimeSlotDivs(this.slots[0].slots);

    // Set the displayed date to the active button
    this.updateSelectedDate();

    // Add submit event listener to the form
    const form = document.querySelector('form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  // Switch the active date button and fill the slots for the selected date
  switchDate(event) {
    event.preventDefault();

    document.querySelectorAll('.active').forEach((date) => {
      date.classList.remove('active', 'btn-info');
    });

    event.target.classList.add('active', 'btn-info');

    // Get the selected date
    let selectedDate = event.target.dataset.bookingDateValue;

    // Find slots for the selected date
    const slotsForDate = this.findSlotsForDate(selectedDate);

    // Delete the slots with class slot before adding the new ones
    document.querySelectorAll('.slot').forEach(slot => slot.remove())

    // Generate new time slot divs
    if (slotsForDate) {
      this.generateTimeSlotDivs(slotsForDate);
    }

    // Update the displayed selected date
    this.updateSelectedDate();
  }

  findSlotsForDate(selectedDate) {
    const slotDataForDate = this.slots.find(day => day.date === selectedDate);
    return slotDataForDate ? slotDataForDate.slots : null;
  }

  generateTimeSlotDivs(slots) {
    // Generate and add new divs for each time slot
    slots.forEach(slot => {
        const div = document.createElement('div');
        let formatted_slot = slot.substring(11, 16);
        div.innerText = `${formatted_slot}h`;
        div.dataset.bookingDateValue = slot;
        div.classList.add('slot', 'btn', 'btn-light', 'border', 'p-3', 'm-1');

        // Add event listener to the div
        div.addEventListener('click', function() {
            // Remove the 'active' class from all divs
            document.querySelectorAll('.slot').forEach(slot => {
                slot.classList.remove('active');
            });

            // Add the 'active' class to the clicked div
            this.classList.add('active');
        });

        // Buttons with available slots for the date selected
        this.timeSelectTarget.parentElement.insertAdjacentElement('beforeend', div);

        // To double-check if the divs are being created
        // console.log(div);
    });
  }

  // Get and format the selected date, then update the displayed selected date
  updateSelectedDate() {
    // Get the active button
    const activeButton = document.querySelector('.active');

    // Get the selected date from the active button
    let selectedDateDisplay = activeButton.dataset.bookingDateValue || this.date || new Date().toISOString().split('T')[0];

    // Update the displayed selected date
    const selectedDateDiv = document.getElementById('selected-date');
    selectedDateDiv.innerText = `Date ${selectedDateDisplay}`;
  }

  handleSubmit(event) {
    event.preventDefault();

    // Get the active slot
    const activeSlot = document.querySelector('.slot.active');

    // Check if a slot is selected
    if (!activeSlot) {
      alert('Please select a time.');
      return;
    }

    // Get the value of the selected slot
    const selectedSlotValue = activeSlot.dataset.bookingDateValue;

    // Create a hidden input element to hold the start_time value
    let hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'start_time';
    hiddenInput.value = selectedSlotValue;

    // Append the hidden input to the form
    event.target.appendChild(hiddenInput);

    // Submit the form
    event.target.submit();
  }
}
