using Microsoft.EntityFrameworkCore.Migrations;

namespace Reservation_API.Migrations
{
    public partial class RectificatingForeignKeyForContactIdInTableReservations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Contacts_CreatedByUserId",
                table: "Reservations");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ContactId",
                table: "Reservations",
                column: "ContactId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Contacts_ContactId",
                table: "Reservations",
                column: "ContactId",
                principalTable: "Contacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Contacts_ContactId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_ContactId",
                table: "Reservations");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Contacts_CreatedByUserId",
                table: "Reservations",
                column: "CreatedByUserId",
                principalTable: "Contacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
