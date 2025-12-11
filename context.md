# 🧾 Technical Context: AI Travel Concierge (End-to-End Trip Planner)

## 1️⃣ Product Summary

The system is a **chat-based travel planning assistant**.
User already knows destination, travel dates, traveler count, and budget.
The assistant retrieves:

* Best flight option
* Best hotel option
* (Optional: basic activities later)

Budget constraint: **total trip cost must fit within user budget**.

Output: **Top 2–3 curated bundles** with:

* Flight details (price, times, airline, layovers)
* Hotel details (price per night, rating, location)
* Booking links (affiliate)

The user should never browse or compare manually — **the assistant selects the best match** based on user preferences.

---

## 2️⃣ Conversational Flow Requirements

**System must extract or confirm these fields:**

* `origin_airport_or_city`
* `destination_city`
* `start_date`
* `end_date`
* `number_of_travelers`
* `budget_total` (or infer per person if missing)
* Optional: preference weights:

  * price-sensitive vs comfort-focused
  * layover tolerance
  * hotel star rating or distance from city center

**If any required field missing → ask clarifying question**
(use slot-filling, no assumptions)

Example:

> “I’m going to Osaka next week.”
> → Ask for dates + origin + budget

After all fields confirmed:
→ Proceed with API searches → Present bundled results

---

## 3️⃣ Recommendation Philosophy

**Primary rule: “Best for your unique preferences”**

Use weighted scoring system (initial defaults):

| Category    | Weight | Factors                                            |
| ----------- | ------ | -------------------------------------------------- |
| Price       | 40%    | Total bundle cost vs budget                        |
| Convenience | 30%    | Layover duration, flight duration, departure times |
| Comfort     | 20%    | Hotel rating, modern amenities                     |
| Location    | 10%    | Distance to city center or main attractions        |

Score formula (simplified V1):

```
score =
 (0.4 * price_score) +
 (0.3 * convenience_score) +
 (0.2 * rating_score) +
 (0.1 * location_score)
```

System must **explain** why each recommendation is chosen.

---

## 4️⃣ Travel APIs (Must Use)

### Flights

**Provider:** *Amadeus Self-Service API*
Endpoints required:

* Flight Offers Search
* Airport & city autocomplete (optional)

### Hotels

**Provider:** *Booking.com Affiliate API or Expedia Rapid API*
Must return:

* Hotel name
* Price per night
* Rating
* Booking redirect link

### Optional supporting APIs (later)

* Google Places / Geocoding API for location scoring
* Currency conversion API if needed

---

## 5️⃣ Backend Architecture (FastAPI)

**Project structure**

```
app/
 ├ main.py
 ├ routers/
 │    ├ chat.py
 │    ├ trip.py
 ├ services/
 │    ├ flights_service.py
 │    ├ hotels_service.py
 │    ├ scoring.py
 ├ models/
 │    ├ trip_request.py    # Full structured fields after NLP
 ├ utils/
 │    ├ nlp_parser.py      # Extract info from user input
 │    ├ currency.py
 ├ db/ (optional initial)
```

**Endpoints**

```
POST /chat                    # LLM chat interaction
POST /trip/parse              # Convert message to structured fields (slot filling)
POST /trip/search             # Query APIs for flights/hotels
GET  /trip/recommendations    # Return ranked bundled results
```

The backend retains trip context in DB/cache across chat turns.

---

## 6️⃣ Data Storage Requirements

Store minimal but essential data:

| Table         | Fields                                                     |
| ------------- | ---------------------------------------------------------- |
| Users         | id, preferences                                            |
| UserTrips     | origin, destination, dates, travelers, budget, preferences |
| SearchResults | trip_id, flight/hotel details, scores, timestamp           |

Cache expiration: preferably < 2 hours (flight price volatility)

---

## 7️⃣ Booking Flow Requirements

V1 Business model → **Affiliate linking**
✔ Backend includes affiliate referral ID
✔ User books on partner site
❌ Backend does NOT collect payment or handle refunds

Legal risk: **low**

---

## 8️⃣ UI + Chat Responsibilities

**Chat must:**

* Ask for missing info
* Confirm final details
* Present **max 3 curated options**:

  * Clearly explained benefits (“This one is cheapest and avoids overnight layovers”)
  * Buttons/links to redirect to flight + hotel booking

Tone: **informative, not casual** (clear reasoning)

---

## 9️⃣ Error Handling

Must gracefully handle:

* API failure or missing availability
* Price changes during conversation
* Incorrect date logic (end < start)
* Cities without airports (retry with nearest airports)

Fallback: Ask user for alternative dates/budget ranges.

---

## 10️⃣ MVP Roadmap

| Phase  | Output                            |
| ------ | --------------------------------- |
| Step 1 | NLP parsing + slot filling system |
| Step 2 | Flight API integration            |
| Step 3 | Hotel API integration             |
| Step 4 | Bundle + scoring system           |
| Step 5 | Chat UI & booking redirect        |

Shipping possible within **4–5 weeks**.

---

## **Key Principle**

✨ **Reduce cognitive load — remove thinking**
The system should decide the best options, not dump search results.

---

That’s **all the core requirements**, structured and explicit.
No creative guessing required — this *is* the ground truth.


