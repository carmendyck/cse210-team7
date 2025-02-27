import re

class Task:
    pass

def get_task_keywords(name, description):
    keyword_bank = ["test", "quiz", "homework", "project"]
    name = name.lower()
    description = description.lower()
    
    top_keywords = []
    max_count = 1

    for keyword in keyword_bank:
        # Build regex pattern dynamically without look-behind
        pattern = rf'\b{re.escape(keyword)}\b'

        keyword_count = len(re.findall(pattern, name)) + len(re.findall(pattern, description))

        if keyword_count == max_count:
            top_keywords.append(keyword)
        elif keyword_count > max_count:
            top_keywords = [keyword]
            max_count = keyword_count  # Update max count

    return top_keywords

