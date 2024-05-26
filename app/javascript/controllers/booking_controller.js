import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="booking"
// Loads the available slots for the current day
export default class extends Controller {
  static targets = [ "date", "timeSelect" ]
  static values = { slots: Array }

  connect() {
    // Set the first date button to active
    this.dateTargets[0].classList.add("active", "btn-info");

    // Preload the data with slots for the next 7 days
    this.slots = this.slotsValue

    // Delete the slots with class slot
    document.querySelectorAll('.slot').forEach(slot => slot.remove())

    // Get the slots for the current date which is the first index of the slots array
    this.generateTimeSlotDivs(this.slots[0].slots);
  }

  // Switch the active date button and fill the slots for the selected date
  switchDate(event) {
    event.preventDefault();

    document.querySelectorAll(".active").forEach((date) => {
      date.classList.remove("active", "btn-info");
    });

    event.target.classList.add("active", "btn-info");

    // Get the selected date
    let selectedDate = event.target.dataset.bookingDateValue.trim();

    // Find slots for the selected date
    const slotsForDate = this.findSlotsForDate(selectedDate);

    // Delete the slots with class slot before adding the new ones
    document.querySelectorAll('.slot').forEach(slot => slot.remove())

    // Generate new time slot divs
    if (slotsForDate) {
      this.generateTimeSlotDivs(slotsForDate);
    }
  }

  findSlotsForDate(selectedDate) {
    const slotDataForDate = this.slots.find(day => day.date === selectedDate);
    return slotDataForDate ? slotDataForDate.slots : null;
  }

  generateTimeSlotDivs(slots) {
    // Generate and add new divs for each time slot
    slots.forEach(slot => {
      const div = document.createElement("div");
      let formatted_slot = slot.substring(11, 16);
      div.innerText = formatted_slot;
      div.dataset.bookingDateValue = slot;
      div.classList.add('slot', 'btn', 'btn-primary', 'p-2', 'm-1');
      // Buttons with available slots for the date selected
      this.timeSelectTarget.parentElement.insertAdjacentElement('beforeend', div);
      // To double-check if the divs are being created
      console.log(div);
    });
  }
}
