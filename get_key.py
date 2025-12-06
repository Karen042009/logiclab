from app import DATA_MANAGER, app

try:
    print("Connecting to database...")
    admins_collection = DATA_MANAGER.get_admins()
    
    print("\nSearching for admins...")
    admins = list(admins_collection.find())
    
    if not admins:
        print("No admin users found in the database.")
    else:
        print(f"Found {len(admins)} admin(s):")
        for admin in admins:
            username = admin.get('username', 'Unknown')
            api_key = admin.get('api_key', 'No API Key')
            print(f"Username: {username}")
            print(f"API Key:  {api_key}")
            print("-" * 30)

except Exception as e:
    print(f"An error occurred: {e}")
