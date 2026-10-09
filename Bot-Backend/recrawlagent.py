from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pickle
import time
import os
from selenium.webdriver.common.action_chains import ActionChains

LOGIN_URL = "https://www.chatbase.co/dashboard/paluss1122/chatbot/eWuN3g6RdpWvEffhIdOy5/sources/website"
COOKIES_FILE = "chatbase_cookies.pkl"

def save_cookies(driver, path):
    with open(path, "wb") as file:
        pickle.dump(driver.get_cookies(), file)

def load_cookies(driver, path):
    if not os.path.exists(path):
        return
    with open(path, "rb") as file:
        cookies = pickle.load(file)
        for cookie in cookies:
            driver.add_cookie(cookie)

def login_and_save_cookies(driver):
    driver.get(LOGIN_URL)
    print("Bitte loggen Sie sich manuell ein. Drücken Sie Enter, wenn Sie fertig sind.")
    input()
    save_cookies(driver, COOKIES_FILE)

def main():
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument(r'--user-data-dir=C:\Users\pauls\AppData\Local\Google\Chrome\User Data Selenium')
    options.add_argument('--profile-directory=Default')

    driver = webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 30)

    driver.get(LOGIN_URL)
    
    # Cookies laden, falls vorhanden
    load_cookies(driver, COOKIES_FILE)
    driver.refresh()

    # Input-Feld suchen und ausfüllen
    try:
        input_field = wait.until(EC.presence_of_element_located((By.ID, "url")))
        input_field.clear()
        input_field.send_keys("hausaufgaben-backend.onrender.com/api/hausaufgaben/today")
        print("Input-Feld mit URL ausgefüllt.")
    except Exception as e:
        print("Fehler beim Ausfüllen des Input-Felds:", e)

    # Submit-Button suchen und klicken
    try:
        submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Fetch links')]")))
        driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
        submit_button.click()
    except Exception as e:
        print("Fehler beim Klicken des Submit-Buttons:", e)

    while True:
        time.sleep(1)

    # driver.quit() # Optional: Browser schließen

if __name__ == "__main__":
    main()
