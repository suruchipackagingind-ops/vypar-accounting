import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateParty,
  useLookupGSTIN,
  useUpdateParty,
} from "@/hooks/useQueries";
import type { CreatePartyRequest, PartyInfo } from "@/types";
import { PartyType } from "@/types";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  editParty?: PartyInfo | null;
}

const EMPTY_FORM = {
  name: "",
  partyType: PartyType.customer as PartyType,
  phone: "",
  email: "",
  address: "",
  gstNumber: "",
};

export function ClientFormDrawer({ open, onClose, editParty }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createParty = useCreateParty();
  const updateParty = useUpdateParty();
  const lookupGSTIN = useLookupGSTIN();

  useEffect(() => {
    if (editParty) {
      setForm({
        name: editParty.name,
        partyType: editParty.partyType,
        phone: editParty.phone ?? "",
        email: editParty.email ?? "",
        address: editParty.address ?? "",
        gstNumber: editParty.gstNumber ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editParty]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (
      form.gstNumber &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        form.gstNumber,
      )
    ) {
      e.gstNumber = "Invalid GST number format (e.g. 22AAAAA0000A1Z5)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const req: CreatePartyRequest = {
      name: form.name.trim(),
      partyType: form.partyType,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
      gstNumber: form.gstNumber.trim().toUpperCase() || undefined,
    };
    try {
      if (editParty) {
        await updateParty.mutateAsync({ id: editParty.id, ...req });
        toast.success("Client updated");
      } else {
        await createParty.mutateAsync(req);
        toast.success("Client added");
      }
      onClose();
    } catch {
      toast.error("Failed to save client");
    }
  };

  const isPending = createParty.isPending || updateParty.isPending;

  const typeOptions: { value: PartyType; label: string }[] = [
    { value: PartyType.customer, label: "Customer" },
    { value: PartyType.vendor, label: "Vendor" },
    { value: PartyType.both, label: "Both" },
  ];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[380px] flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="text-sm font-semibold">
            {editParty ? "Edit Client" : "Add New Client"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Name *</Label>
            <Input
              data-ocid="client_form.name_input"
              className="h-8 text-xs"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Ramesh Enterprises"
            />
            {errors.name && (
              <p
                className="text-xs text-destructive"
                data-ocid="client_form.name_field_error"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Type *</Label>
            <div className="flex gap-1" data-ocid="client_form.type_toggle">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, partyType: opt.value }))
                  }
                  className={`flex-1 h-8 text-xs rounded border transition-colors ${
                    form.partyType === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Phone</Label>
            <Input
              data-ocid="client_form.phone_input"
              className="h-8 text-xs"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Email</Label>
            <Input
              data-ocid="client_form.email_input"
              type="email"
              className="h-8 text-xs"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="contact@example.com"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">GST Number</Label>
            <div className="flex gap-1.5 items-center">
              <Input
                data-ocid="client_form.gst_input"
                className="h-8 text-xs font-mono uppercase flex-1"
                value={form.gstNumber}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    gstNumber: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="client_form.gst_autofetch_button"
                className="h-8 px-2.5 text-xs shrink-0 gap-1.5 border-primary/40 text-primary hover:bg-primary/5"
                disabled={
                  !form.gstNumber ||
                  form.gstNumber.length !== 15 ||
                  lookupGSTIN.isPending
                }
                onClick={async () => {
                  try {
                    const data = await lookupGSTIN.mutateAsync(form.gstNumber);
                    const name =
                      data.tradeName?.trim() || data.legalName?.trim();
                    const address = [
                      data.principalAddress,
                      data.state,
                      data.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ");
                    setForm((f) => ({
                      ...f,
                      name: name || f.name,
                      address: address || f.address,
                    }));
                    toast.success("GST details fetched successfully");
                  } catch (err) {
                    toast.error(
                      err instanceof Error ? err.message : "Lookup failed",
                    );
                  }
                }}
              >
                {lookupGSTIN.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
                <span>Auto-fill</span>
              </Button>
            </div>
            {errors.gstNumber && (
              <p
                className="text-xs text-destructive"
                data-ocid="client_form.gst_field_error"
              >
                {errors.gstNumber}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Address</Label>
            <Textarea
              data-ocid="client_form.address_input"
              className="text-xs min-h-[64px] resize-none"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              placeholder="Street, City, State, PIN"
            />
          </div>
        </div>

        <SheetFooter className="px-5 py-4 border-t gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="client_form.cancel_button"
            className="flex-1 h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isPending}
            data-ocid="client_form.submit_button"
            className="flex-1 h-8 text-xs"
          >
            {isPending ? "Saving…" : editParty ? "Update" : "Add Client"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
