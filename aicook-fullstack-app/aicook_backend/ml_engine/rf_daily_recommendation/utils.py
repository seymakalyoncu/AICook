from django.db.models.functions import TruncDate

REQUIRED_DAY_COUNT = 10
def get_unique_day_count(meal_histories):
    return (
        meal_histories
        .annotate(day=TruncDate("cooked_date"))
        .values("day")
        .distinct()
        .count()
    )

def has_enough_data(meal_histories):
    return get_unique_day_count(meal_histories) >= REQUIRED_DAY_COUNT
