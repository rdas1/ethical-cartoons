import DiscussionPanel from "@/components/DiscussionPanel";

export default function TrolleyVsTransplantDiscussionPanel() {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center scroll-snap-start bg-white text-black my-6 p-6">
      <DiscussionPanel
        title="What's the ethical difference between these two scenarios?"
        prompt="In both the Trolley and Transplant dilemmas, you decide whether to sacrifice one person to save five. Yet most people respond to these situations differently. Why? What do you think makes these situations feel so different?"
        discussionSlug="trolley-vs-transplant"
      />    
    </section>
  );
}
