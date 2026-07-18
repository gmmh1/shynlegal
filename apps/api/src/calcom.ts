import { config } from "./config.js";

function getHeaders() {
  if (!config.calcomApiKey) {
    throw new Error("CALCOM_API_KEY is not configured");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.calcomApiKey}`,
  };
}

export async function createCalcomBooking(input: {
  eventTypeId: number;
  start: string;
  end: string;
  name: string;
  email: string;
  timeZone?: string;
  notes?: string;
}) {
  const response = await fetch(`${config.calcomBaseUrl}/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      eventTypeId: input.eventTypeId,
      start: input.start,
      end: input.end,
      name: input.name,
      email: input.email,
      timeZone: input.timeZone ?? "Europe/London",
      notes: input.notes,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Cal.com booking create failed: ${detail}`);
  }

  return response.json();
}

export async function rescheduleCalcomBooking(
  bookingId: string,
  start: string,
  end: string,
) {
  const response = await fetch(
    `${config.calcomBaseUrl}/bookings/${bookingId}/reschedule`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ start, end }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Cal.com reschedule failed: ${detail}`);
  }

  return response.json();
}

export async function cancelCalcomBooking(bookingId: string, reason?: string) {
  const response = await fetch(
    `${config.calcomBaseUrl}/bookings/${bookingId}/cancel`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        reason: reason ?? "Cancelled by Shyn Legal operator",
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Cal.com cancel failed: ${detail}`);
  }

  return response.json();
}

export async function listCalcomSlots(
  eventTypeId: number,
  startTime: string,
  endTime: string,
  timeZone = "Europe/London",
) {
  const params = new URLSearchParams({
    eventTypeId: String(eventTypeId),
    startTime,
    endTime,
    timeZone,
  });

  const response = await fetch(
    `${config.calcomBaseUrl}/slots?${params.toString()}`,
    {
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Cal.com slot lookup failed: ${detail}`);
  }

  return response.json();
}
