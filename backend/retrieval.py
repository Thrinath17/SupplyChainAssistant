from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
import os
from openai import OpenAI

# Initialize the OpenAI client with your API key
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

# Upload the textbook.pdf file and create a file object in OpenAI
with open("textbook.pdf", 'rb') as file:
    uploaded_file = client.files.create(
        file=file,
        purpose='assistants',
    )

# Initialize the assistant and thread globally
assistant = None
thread = None

def initialize_assistant_and_thread():
    global assistant, thread
    
    # Create the assistant
    assistant = client.beta.assistants.create(
        name="Supply Chain Design Companions",
        instructions="You're supply chain network design mentor. This tool is to help students studying supply chain network design at their bachelor's, master's, and PhD levels.",
        tools=[{"type": "retrieval"}],
        model="gpt-3.5-turbo-1106",
        file_ids=[uploaded_file.id]  # Assumes uploaded_file is available
    )
    
    # Create the thread
    thread = client.beta.threads.create()
    
# Call the function to initialize the assistant and thread upon loading the script
initialize_assistant_and_thread()

# Function to process a query and return the assistant's response
def process_query(query):
    global thread
    
    if thread is None:
        raise Exception("Thread has not been initialized.")
    
    client.beta.threads.messages.create(thread_id=thread.id, role="user", content=query)

    run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=assistant.id)

    # Simplified loop: Wait for the completion of the assistant's response
    while client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id).status != "completed":
        pass  # Just wait here, do nothing until the run is completed
    
    # Once completed, get the latest messages from the thread
    thread_messages = client.beta.threads.messages.list(thread_id=thread.id).data
    
    # Process the messages to collect role and value
    all_contents = []
    for message in reversed(thread_messages):  # Process in reverse to maintain chronological order
        if message.content and message.content[0].type == "text":
            all_contents.append({"role": message.role, "value": message.content[0].text.value})
    
    return all_contents
